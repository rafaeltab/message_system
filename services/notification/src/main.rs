mod adapters;
mod config;
mod connection_manager;
mod domain;
mod infrastructure;
mod ports;

use std::sync::Arc;

use adapters::{
    rdkafka_adapter::{RdkafkaAdapter, RdkafkaConfig, RdkafkaSaslConfig},
    redis_adapter::RedisAdapter,
    socket_adapter::SocketAdapter,
    tonic_sink_adapter::TonicSinkAdapter,
    tonic_source_adapter::TonicSourceAdapter,
};
use clap::Parser;
use config::{load_config, AppConfig};
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
    #[arg(long, env, default_value = "./config.yaml")]
    pub config: String,
}

#[main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    Builder::with_level("info")
        .with_target_writer("*", new_writer(tokio::io::stdout()))
        .init();

    let args = Arguments::parse();

    let config: AppConfig = load_config(args.config)?;

    let connection_manager = Arc::new(ConnManager::new());

    let redis_adapter = Arc::new(RedisAdapter::new(config.redis.url).await.unwrap());
    let route_repository: Arc<dyn RouteRepository> = Arc::new(RouteRepositoryImpl::new(
        redis_adapter.clone(),
        config.route.url,
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

    let kafka = Box::leak(Box::new(config.kafka.clone()));
    let brokers = kafka.get_kafka_brokers();
    let topics = kafka.get_kafka_topics();
    let rdkafka_config = RdkafkaConfig {
        brokers: Box::leak(Box::new(brokers)),
        group_id: Box::leak(Box::new(config.kafka.group_id)),
        topics: Box::leak(Box::new(topics)).as_slice(),
        workers: kafka.workers,
        sasl: match config.kafka.sasl {
            Some(sasl) => Some(RdkafkaSaslConfig {
                mechanism: Box::leak(Box::new(sasl.mechanism)),
                username: Box::leak(Box::new(sasl.username)),
                password: Box::leak(Box::new(sasl.password)),
            }),
            None => None,
        },
    };

    join_all(vec![
        tokio::spawn(async {
            socket_adapter.start_listening(config.web_socket.url).await;
        }),
        tokio::spawn(async move {
            let _ = tonic_source_adapter.start_listening(config.grpc.url).await;
        }),
        tokio::spawn(async move {
            let _ = rdkafka_adapter.start_listening(rdkafka_config).await;
        }),
    ])
    .await;

    Ok(())
}
