use std::env;

use anyhow::Error;
use axum::{
    Router,
    http::{HeaderValue, Method},
    routing::get,
};

use tokio::net::TcpListener;
use tower_http::cors::CorsLayer;
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

    let cors = if origin == "*" {
        // Use any() for wildcard
        CorsLayer::new().allow_origin(tower_http::cors::Any)
    } else {
        // Use specific origins
        let origins = origin
            .split(';')
            .filter_map(|o| HeaderValue::from_str(o).ok())
            .collect::<Vec<HeaderValue>>();
        
        CorsLayer::new().allow_origin(origins)
    };

    Ok(cors.allow_methods([Method::GET, Method::CONNECT]))
}
