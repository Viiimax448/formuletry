use std::{env, sync::Arc};

use anyhow::Error;
use axum::{
    Router,
    http::{HeaderValue, Method},
    routing::get,
};
use tokio::{net::TcpListener, sync::broadcast::Sender};
use tower_http::cors::CorsLayer;
use tracing::info;

use crate::services::state_service::StateService;

mod connections;
mod current;
mod drivers;
mod health;
mod realtime;

pub struct Context {
    pub state_service: StateService,
    pub tx: Sender<String>,
}

pub async fn start(state_service: StateService, tx: Sender<String>) -> Result<(), Error> {
    let port = env::var("PORT").unwrap_or_else(|_| "80".to_string());
    let addr = env::var("ADDRESS").unwrap_or_else(|_| format!("0.0.0.0:{}", port));

    let context = Arc::new(Context { state_service, tx });

    let cors = cors_layer()?;

    let app = Router::new()
        .route("/api/health", get(health::health_check))
        .route("/api/realtime", get(realtime::sse_stream))
        .route("/api/realtime/", get(realtime::sse_stream))
        .route("/api/current", get(current::current_state))
        .route("/api/drivers", get(drivers::drivers))
        .route("/api/connections", get(connections::current_connections))
        .with_state(context)
        .layer(cors)
        .into_make_service();

    info!(addr, "starting norths http server");

    axum::serve(TcpListener::bind(addr).await?, app).await?;

    Ok(())
}

pub fn cors_layer() -> Result<CorsLayer, Error> {
    let origin = env::var("ORIGIN").unwrap_or_else(|_| "https://formuletry.vercel.app;https://f1-dash.com".to_string());

    // Handle CORS with robust wildcard/empty logic
    let cors = if origin.trim() == "*" || origin.trim().is_empty() {
        CorsLayer::new()
            .allow_origin(tower_http::cors::Any)
            .allow_headers(tower_http::cors::Any)
    } else {
        let origins: Vec<HeaderValue> = origin
            .split(';')
            .map(|s| s.trim())
            .filter(|s| !s.is_empty() && *s != "*")
            .filter_map(|o| HeaderValue::from_str(o).ok())
            .collect();

        if origins.is_empty() {
            CorsLayer::new()
                .allow_origin(tower_http::cors::Any)
                .allow_headers(tower_http::cors::Any)
        } else {
            CorsLayer::new()
                .allow_origin(origins)
                .allow_headers(tower_http::cors::Any)
        }
    };

    Ok(cors.allow_methods([Method::GET, Method::CONNECT, Method::OPTIONS]))
}
