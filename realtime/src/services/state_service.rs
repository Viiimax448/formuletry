use anyhow::Error;
use serde_json::Value;
use std::sync::Arc;
use tokio::sync::RwLock;
use tracing::info;

const BEST_LAPS_FILE: &str = "best_lap_segments.json";

#[derive(Clone)]
pub struct StateService {
    state: Arc<RwLock<Value>>,
}

impl StateService {
    pub fn new() -> Self {
        let mut initial_state = serde_json::Map::new();

        // Attempt to load persisted best lap segments from disk if available
        if let Ok(content) = std::fs::read_to_string(BEST_LAPS_FILE) {
            if let Ok(parsed) = serde_json::from_str::<Value>(&content) {
                if parsed.is_object() {
                    info!("Loaded persisted BestLapSegments from {}", BEST_LAPS_FILE);
                    initial_state.insert("BestLapSegments".to_string(), parsed);
                }
            }
        }

        Self {
            state: Arc::new(RwLock::new(Value::Object(initial_state))),
        }
    }

    pub async fn get_state(&self) -> Result<Value, Error> {
        let state = self.state.read().await;
        Ok(state.clone())
    }

    pub async fn get_state_string(&self) -> Result<String, Error> {
        let state = self.state.read().await;
        Ok(state.to_string())
    }

    pub async fn set_state(&self, new_state: Value) -> Result<(), Error> {
        let mut state = self.state.write().await;
        *state = new_state;
        Ok(())
    }

    pub async fn update_state(&self, update: Value) -> Result<(), Error> {
        let mut state = self.state.write().await;

        // Check for personal best segments before merging update
        capture_best_lap_segments(&mut state, &update);

        merge(&mut state, update);
        Ok(())
    }
}

fn capture_best_lap_segments(state: &mut Value, update: &Value) {
    let Some(lines) = update.pointer("/TimingData/Lines").and_then(|v| v.as_object()) else {
        return;
    };

    let mut has_new_pb = false;

    for (driver_num, driver_update) in lines {
        let is_pb = driver_update
            .pointer("/LastLapTime/PersonalFastest")
            .and_then(|v| v.as_bool())
            .unwrap_or(false)
            || driver_update
                .pointer("/LastLapTime/OverallFastest")
                .and_then(|v| v.as_bool())
                .unwrap_or(false)
            || {
                let last = driver_update.pointer("/LastLapTime/Value").and_then(|v| v.as_str());
                let best = driver_update.pointer("/BestLapTime/Value").and_then(|v| v.as_str());
                last.is_some() && best.is_some() && last == best
            };

        if !is_pb {
            continue;
        }

        // Get sectors: try from the update first, then fallback to existing state
        let sectors_opt = driver_update.get("Sectors").or_else(|| {
            state.pointer(&format!("/TimingData/Lines/{}/Sectors", driver_num))
        });

        let Some(sectors) = sectors_opt else {
            continue;
        };

        let mut sectors_segments: Vec<Value> = Vec::new();

        if let Some(sec_map) = sectors.as_object() {
            for i in 0..3 {
                let i_str = i.to_string();
                if let Some(sec) = sec_map.get(&i_str) {
                    if let Some(segs) = sec.get("Segments").and_then(|s| s.as_array()) {
                        sectors_segments.push(Value::Array(segs.clone()));
                    } else if let Some(segs_obj) = sec.get("Segments").and_then(|s| s.as_object()) {
                        let mut seg_list = Vec::new();
                        let mut k = 0;
                        while let Some(seg) = segs_obj.get(&k.to_string()) {
                            seg_list.push(seg.clone());
                            k += 1;
                        }
                        sectors_segments.push(Value::Array(seg_list));
                    }
                }
            }
        } else if let Some(sec_arr) = sectors.as_array() {
            for sec in sec_arr.iter().take(3) {
                if let Some(segs) = sec.get("Segments").and_then(|s| s.as_array()) {
                    sectors_segments.push(Value::Array(segs.clone()));
                } else if let Some(segs_obj) = sec.get("Segments").and_then(|s| s.as_object()) {
                    let mut seg_list = Vec::new();
                    let mut k = 0;
                    while let Some(seg) = segs_obj.get(&k.to_string()) {
                        seg_list.push(seg.clone());
                        k += 1;
                    }
                    sectors_segments.push(Value::Array(seg_list));
                }
            }
        }

        // Verify there is at least one active segment in this lap
        let has_valid_segments = sectors_segments.iter().any(|sec| {
            sec.as_array().map_or(false, |arr| {
                arr.iter().any(|item| {
                    item.get("Status").and_then(|s| s.as_i64()).unwrap_or(0) > 0
                })
            })
        });

        if has_valid_segments {
            let best_map = state
                .as_object_mut()
                .map(|map| map.entry("BestLapSegments".to_string()).or_insert_with(|| Value::Object(serde_json::Map::new())));

            if let Some(Value::Object(map)) = best_map {
                info!("Captured authentic BestLapSegments for driver {}", driver_num);
                map.insert(driver_num.clone(), Value::Array(sectors_segments));
                has_new_pb = true;
            }
        }
    }

    if has_new_pb {
        if let Some(best_laps) = state.get("BestLapSegments") {
            if let Ok(json_str) = serde_json::to_string(best_laps) {
                let _ = std::fs::write(BEST_LAPS_FILE, json_str);
            }
        }
    }
}

pub fn merge(base: &mut Value, update: Value) {
    match (base, update) {
        (Value::Object(prev), Value::Object(update)) => {
            for (k, v) in update {
                merge(prev.entry(k).or_insert(Value::Null), v);
            }
        }
        (Value::Array(prev), Value::Object(update)) => {
            for (k, v) in update {
                if let Ok(index) = k.parse::<usize>() {
                    if let Some(item) = prev.get_mut(index) {
                        merge(item, v);
                    } else {
                        prev.push(v);
                    }
                }
            }
        }
        (a, b) => *a = b,
    }
}
