use reqwest::header::{self, HeaderValue};
use serde::{Deserialize, Serialize};
use futures::{SinkExt, StreamExt};
use tokio_tungstenite::tungstenite::{Message, client::IntoClientRequest, http::Request};

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
struct NegotiationResponse {
    connection_id: String,
    connection_token: String,
}

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

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = reqwest::Client::new();
    let negotiate_url = "https://livetiming.formula1.com/signalrcore/negotiate?negotiateVersion=1";
    println!("Negotiating with {}", negotiate_url);
    
    let res = client.post(negotiate_url).send().await?;
    let headers = res.headers().clone();
    let cookie = headers.get(header::SET_COOKIE)
        .and_then(|v| v.to_str().ok())
        .map(|s| s.to_string());
    
    let text = res.text().await?;
    let neg: NegotiationResponse = serde_json::from_str(&text)?;
    println!("Connection Token: {}", neg.connection_token);
    
    let ws_url = format!("wss://livetiming.formula1.com/signalrcore?id={}", neg.connection_token);
    println!("Connecting to WebSocket: {}", ws_url);
    
    let mut req: Request<()> = ws_url.into_client_request()?;
    let req_headers = req.headers_mut();
    req_headers.insert(header::USER_AGENT, HeaderValue::from_static("BestHTTP"));
    req_headers.insert(
        header::ACCEPT_ENCODING,
        HeaderValue::from_static("gzip,identity"),
    );
    if let Some(ref c) = cookie {
        req_headers.insert(header::COOKIE, c.parse()?);
    }
    
    let (mut stream, _response) = tokio_tungstenite::connect_async(req).await?;
    println!("Connected!");
    
    // Step 4: Handshake
    let handshake = "{\"protocol\":\"json\",\"version\":1}\u{1E}";
    stream.send(Message::Text(handshake.to_string().into())).await?;
    
    if let Some(msg) = stream.next().await {
        println!("Handshake Response: {:?}", msg?);
    }
    
    // Step 6: Subscribe to ALL topics
    let topics_json = serde_json::to_string(&TOPICS)?;
    let subscribe_msg = format!("{{\"type\":1,\"target\":\"Subscribe\",\"arguments\":[{}],\"invocationId\":\"1\"}}\u{1E}", topics_json);
    println!("Sending subscribe message");
    stream.send(Message::Text(subscribe_msg.into())).await?;
    
    // Step 7: Receive messages
    let mut count = 0;
    while let Some(msg) = stream.next().await {
        let msg = msg?;
        if let Message::Text(ref txt) = msg {
            for part in txt.split('\u{1E}') {
                if part.is_empty() { continue; }
                println!("MESSAGE PART: {}", part);
                count += 1;
            }
        } else {
            println!("Non-text message: {:?}", msg);
            count += 1;
        }
        if count >= 15 {
            break;
        }
    }
    
    Ok(())
}
