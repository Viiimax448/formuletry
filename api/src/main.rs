use std::env;

use anyhow::Error;
use axum::{
    Router,
    http::{HeaderValue, Method},
    routing::get,
};

use tokio::net::TcpListener;
use tower_http::cors::{CorsLayer, Any};
use tracing::info;

use shared::tracing_subscriber;

mod endpoints {
    pub(crate) mod health;
    pub(crate) mod schedule;
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing_subscriber();

    // Railway provides PORT, fallback to ADDRESS or default
    let port = env::var("PORT").unwrap_or_else(|_| "80".to_string());
    let addr = env::var("ADDRESS").unwrap_or_else(|_| format!("0.0.0.0:{}", port));

    let cors_layer = cors_layer()?;

    let app = Router::new()
        .route("/api/schedule", get(endpoints::schedule::get))
        .route("/api/schedule/next", get(endpoints::schedule::get_next))
        .route("/api/health", get(endpoints::health::check))
        .layer(cors_layer);

    info!(addr, "starting api http server");

    axum::serve(TcpListener::bind(addr).await?, app).await?;

    Ok(())
}

pub fn cors_layer() -> Result<CorsLayer, anyhow::Error> {
    let origin = env::var("ORIGIN").unwrap_or_else(|_| "https://f1-dash.com".to_string());

    // Simplified CORS logic
    let cors = if origin.trim() == "*" {
        CorsLayer::new().allow_origin(Any)
    } else {
        // Parse specific origins, but handle wildcards safely
        let origins: Vec<HeaderValue> = origin
            .split(';')
            .map(|s| s.trim())
            .filter(|s| !s.is_empty() && *s != "*")  // Filter out wildcards
            .filter_map(|o| HeaderValue::from_str(o).ok())
            .collect();
        
        if origins.is_empty() {
            CorsLayer::new().allow_origin(Any)
        } else {
            CorsLayer::new().allow_origin(origins)
        }
    };

    Ok(cors.allow_methods([Method::GET, Method::CONNECT]))
}
