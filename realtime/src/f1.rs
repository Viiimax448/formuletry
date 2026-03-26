use anyhow::{anyhow, Error};
use serde_json::{Value, json};
use tokio::sync::broadcast::Sender;
use tokio_stream::StreamExt;
use tokio::time::{timeout, Duration};
use tracing::{error, trace, warn};

use crate::services::state_service::StateService;

const URL: &str = "livetiming.formula1.com/signalr";
const HUB: &str = "Streaming";

const TOPICS: [&str; 17] = [
    "Heartbeat",
    "CarData.z",
    "Position.z",
    "ExtrapolatedClock",
    "TimingStats",
    "TimingAppData",
    "WeatherData",
    "TrackStatus",
    "SessionStatus",
    "DriverList",
    "RaceControlMessages",
    "SessionInfo",
    "SessionData",
    "LapCount",
    "TimingData",
    "TeamRadio",
    "ChampionshipPrediction",
];

pub async fn ingest_f1(
    state_service: StateService,
    update_sender: Sender<String>,
) -> Result<(), Error> {
    let mut signalr_client = signalr::create_client(URL, HUB).await?;

    let initial = signalr::subscribe(&mut signalr_client, &TOPICS).await?;
    handle_initial(&state_service, initial).await?;

    let mut stream = signalr::listen(signalr_client);

    // Watchdog: si no recibimos ningún mensaje en este periodo, consideramos la conexión colgada
    let idle_timeout = Duration::from_secs(15);

    loop {
        // Esperamos al siguiente batch de items con timeout
        let next_items = match timeout(idle_timeout, stream.next()).await {
            Ok(maybe_items) => maybe_items,
            Err(_) => {
                warn!(
                    ?idle_timeout,
                    "SignalR stream idle for too long, restarting connection"
                );
                return Err(anyhow!("SignalR idle timeout"));
            }
        };

        // Si el stream terminó, dejamos que la capa superior reintente la conexión
        let Some(items) = next_items else {
            warn!("SignalR stream ended, restarting connection");
            return Ok(());
        };

        for update in items {
            trace!(?update.topic, "Received data for topic");

            if update.topic == "SessionInfo" && update.data.pointer("/Name").is_some() {
                warn!("received SessionInfo event, restarting...");
                return Ok(());
            }

            match handle_update(&update_sender, &state_service, update.topic, update.data).await {
                Ok(_) => trace!("handled update"),
                Err(err) => error!(?err, "failed to handle update"),
            };
        }
    }
}

async fn handle_update(
    sender: &Sender<String>,
    state_service: &StateService,
    topic: String,
    update: Value,
) -> Result<(), Error> {
    let update = json!({ topic: update });

    match sender.send(update.to_string()) {
        Ok(_) => trace!("sent update to realtime channel"),
        Err(err) => error!(?err, "failed to send update to realtime channel"),
    };

    state_service.update_state(update).await?;

    Ok(())
}

async fn handle_initial(state_service: &StateService, initial: Value) -> Result<(), Error> {
    trace!("handling initial state");
    state_service.set_state(initial).await?;
    Ok(())
}
