mod adapters;
mod connection_manager;
mod domain;
mod infrastructure;
mod ports;

use std::io::Error;

use adapters::{
    redis_adapter::RedisAdapter, socket_adapter::SocketAdapter,
    tonic_sink_adapter::TonicSinkAdapter, tonic_source_adapter::TonicSourceAdapter,
};
use clap::Parser;
use connection_manager::ConnManager;
use domain::route::repositories::route_repository::RouteRepository;
use futures_util::future::join_all;
use infrastructure::{
    notification::repositories::notification_repository::NotificationRepositoryImpl,
    route::repositories::route_repository::RouteRepositoryImpl,
};
use ports::{
    notification_port::NotificationSource,
    route_port::{RouteSink, RouteSource},
};
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
}

#[main]
async fn main() -> Result<(), Error> {
    Builder::with_level("info")
        .with_target_writer("*", new_writer(tokio::io::stdout()))
        .init();

    let args = Arguments::parse();

    let connection_manager = Box::leak(Box::new(ConnManager::new()));

    let redis_adapter: &mut dyn RouteSink =
        Box::leak(Box::new(RedisAdapter::new(args.redis_url).await.unwrap()));
    let route_repository: &mut dyn RouteRepository = Box::leak(Box::new(RouteRepositoryImpl::new(
        redis_adapter,
        args.route_url,
        connection_manager,
    )));

    let route_source = Box::leak(Box::new(RouteSource::new(route_repository)));

    let socket_adapter = SocketAdapter::new(connection_manager, route_source);

    let tonic_sink_adapter = Box::leak(Box::new(TonicSinkAdapter::default()));
    let notification_repository = Box::leak(Box::new(NotificationRepositoryImpl::new(
        route_repository,
        socket_adapter,
        tonic_sink_adapter,
    )));

    let notification_source = Box::leak(Box::new(NotificationSource::new(notification_repository)));
    let tonic_source_adapter = TonicSourceAdapter::new(notification_source);
    join_all(vec![
        tokio::spawn(async {
            socket_adapter.start_listening(args.websocket_url).await;
        }),
        tokio::spawn(async move {
            let _ = tonic_source_adapter.start_listening(args.grpc_url).await;
        }),
    ])
    .await;

    Ok(())
}
