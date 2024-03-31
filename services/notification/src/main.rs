mod adapters;
mod connection_manager;
mod domain;
mod infrastructure;
mod ports;

use std::{io::Error, sync::Arc};

use adapters::{
    rdkafka_adapter::{RdkafkaAdapter, RdkafkaConfig},
    redis_adapter::RedisAdapter,
    socket_adapter::SocketAdapter,
    tonic_sink_adapter::TonicSinkAdapter,
    tonic_source_adapter::TonicSourceAdapter,
};
use clap::Parser;
use connection_manager::ConnManager;
use domain::route::repositories::route_repository::RouteRepository;
use futures_util::future::join_all;
use infrastructure::{
    notification::repositories::notification_repository::NotificationRepositoryImpl,
    route::repositories::route_repository::RouteRepositoryImpl,
};
use ports::{notification_port::NotificationSource, route_port::RouteSource};
use structured_logger::{async_json::new_writer, Builder};
use tokio::main;

#[derive(Parser, Debug)]
#[command(version, about, long_about=None)]
struct Arguments {
    #[arg(long, env)]
    pub redis_url: String,

    #[arg(long, env)]
    pub websocket_url: String,

    #[arg(long, env)]
    pub grpc_url: String,

    #[arg(long, env)]
    pub route_url: String,

    #[arg(long, env)]
    pub kafka_config: String,
}

#[main]
async fn main() -> Result<(), Error> {
    Builder::with_level("info")
        .with_target_writer("*", new_writer(tokio::io::stdout()))
        .init();

    let args = Arguments::parse();

    let connection_manager = Arc::new(ConnManager::new());

    let redis_adapter = Arc::new(RedisAdapter::new(args.redis_url).await.unwrap());
    let route_repository: Arc<dyn RouteRepository> = Arc::new(RouteRepositoryImpl::new(
        redis_adapter.clone(),
        args.route_url,
        connection_manager.clone(),
    ));

    let route_source = Arc::new(RouteSource::new(route_repository.clone()));

    let socket_adapter = Arc::new(SocketAdapter::new(
        connection_manager.clone(),
        route_source.clone(),
    ));

    let tonic_sink_adapter = Arc::new(TonicSinkAdapter::default());
    let notification_repository = Arc::new(NotificationRepositoryImpl::new(
        route_repository.clone(),
        socket_adapter.clone(),
        tonic_sink_adapter.clone(),
    ));

    let notification_source = Arc::new(NotificationSource::new(notification_repository.clone()));
    let tonic_source_adapter = Arc::new(TonicSourceAdapter::new(notification_source.clone()));
    let rdkafka_adapter = Arc::new(RdkafkaAdapter::new(notification_source.clone()));
    join_all(vec![
        tokio::spawn(async {
            socket_adapter.start_listening(args.websocket_url).await;
        }),
        tokio::spawn(async move {
            let _ = tonic_source_adapter.start_listening(args.grpc_url).await;
        }),
        tokio::spawn(async move {
            let _ = rdkafka_adapter
                .start_listening(RdkafkaConfig {
                    brokers: "",
                    group_id: "",
                    topics: &[""],
                    workers: 2,
                })
                .await;
        }),
    ])
    .await;

    Ok(())
}
