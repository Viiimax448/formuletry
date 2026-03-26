use anyhow::Error;
use shared::tracing_subscriber;
use tokio::sync::broadcast;
use tracing::warn;

use crate::services::state_service::StateService;

mod f1;
mod http_server;
mod services {
    pub mod state_service;
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing_subscriber();

    let state_service = StateService::new();

    let (sender, _) = broadcast::channel::<String>(16);

    {
        let state_service = state_service.clone();
        let sender = sender.clone();
        tokio::spawn(async move {
            // Backoff inicial en segundos para reconectar
            let mut backoff_secs: u64 = 3;

            loop {
                match f1::ingest_f1(state_service.clone(), sender.clone()).await {
                    Ok(_) => {
                        // ingest_f1 terminó "limpio" (por ejemplo, cambio de sesión)
                        // Reseteamos el backoff para la siguiente conexión
                        backoff_secs = 3;
                    }
                    Err(err) => {
                        warn!(?err, "ingest_f1 method returned error");
                    }
                };

                warn!(
                    backoff_secs,
                    "ingest_f1 returned, restarting after backoff seconds"
                );

                tokio::time::sleep(tokio::time::Duration::from_secs(backoff_secs)).await;

                // Backoff exponencial acotado para evitar reconectar en bucle muy rápido
                backoff_secs = (backoff_secs * 2).min(30);
            }
        });
    }

    http_server::start(state_service, sender).await?;

    Ok(())
}
