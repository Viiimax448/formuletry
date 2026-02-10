use std::env;

use anyhow::Error;
use axum::{
    Router,
    http::{HeaderValue, Method, StatusCode, Uri},
    routing::get,
    response::Json,
};
use serde_json;

use tokio::net::TcpListener;
use tower_http::cors::{CorsLayer, Any};
use tracing::info;

use shared::tracing_subscriber;

mod endpoints {
    pub(crate) mod health;
    pub(crate) mod schedule;
}

async fn fallback_handler(uri: Uri) -> (StatusCode, Json<serde_json::Value>) {
    tracing::warn!("No route found for: {}", uri);
    (
        StatusCode::NOT_FOUND,
        Json(serde_json::json!({
            "error": "Route not found",
            "path": uri.to_string(),
            "available_routes": [
                "/api/health",
                "/api/schedule", 
                "/api/schedule/next"
            ]
        }))
    )
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing_subscriber();

    // Railway provides PORT, fallback to ADDRESS or default
    let port = env::var("PORT").unwrap_or_else(|_| "80".to_string());
    let addr = env::var("ADDRESS").unwrap_or_else(|_| format!("0.0.0.0:{}", port));

    let app = Router::new()
        .route("/api/schedule", get(endpoints::schedule::get))
        .route("/api/schedule/next", get(endpoints::schedule::get_next))
        .route("/api/health", get(endpoints::health::check))
        .fallback(fallback_handler)
        .layer(cors_layer()?);;

    info!("Routes registered:");
    info!("  GET /api/health");
    info!("  GET /api/schedule");
    info!("  GET /api/schedule/next");
    info!(addr, "starting api http server");

    axum::serve(TcpListener::bind(addr).await?, app).await?;

    Ok(())
}

pub fn cors_layer() -> Result<CorsLayer, anyhow::Error> {
    let origin = env::var("ORIGIN").unwrap_or_else(|_| "https://formuletry.com".to_string());

    // Handle CORS with better wildcard logic
    let cors = if origin.trim() == "*" || origin.trim().is_empty() {
        // Always use Any for wildcard or empty
        CorsLayer::new().allow_origin(Any)
    } else {
        // Parse specific origins
        let origins: Vec<HeaderValue> = origin
            .split(';')
            .map(|s| s.trim())
            .filter(|s| !s.is_empty() && *s != "*")  // Filter out wildcards and empty
            .filter_map(|o| {
                match HeaderValue::from_str(o) {
                    Ok(header) => Some(header),
                    Err(_) => {
                        eprintln!("Failed to parse origin: {}", o);
                        None
                    }
                }
            })
            .collect();
        
        if origins.is_empty() {
            // Fallback to Any if no valid origins
            eprintln!("No valid origins found, using Any");
            CorsLayer::new().allow_origin(Any)
        } else {
            CorsLayer::new().allow_origin(origins)
        }
    };

    Ok(cors.allow_methods([Method::GET, Method::CONNECT]))
}
