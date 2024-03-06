mod adapters;
mod connection_manager;
mod domain;
mod infrastructure;
mod ports;

use std::io::Error;

use adapters::{redis_adapter::RedisAdapter, socket_adapter::SocketAdapter};
use clap::Parser;
use connection_manager::{ConnManager, ConnectionManager};
use domain::route::repositories::route_repository::{self, RouteRepository};
use futures_util::future::join_all;
use infrastructure::route::repositories::route_repository::RouteRepositoryImpl;
use ports::route_port::{RouteSink, RouteSource};
use simple_logger::SimpleLogger;
use tokio::main;

#[derive(Parser, Debug)]
#[command(version, about, long_about=None)]
struct Arguments {
    #[arg(short, long, env)]
    pub redis_url: String,

    #[arg(short, long, env)]
    pub listen_url: String,
}

#[main]
async fn main() -> Result<(), Error> {
    SimpleLogger::new()
        .with_level(log::LevelFilter::Info)
        .init()
        .unwrap();

    let args = Arguments::parse();

    let connection_manager: &mut Box<dyn ConnectionManager> =
        Box::leak(Box::new(Box::new(ConnManager::new())));
    let redis_adapter: &mut Box<dyn RouteSink> = Box::leak(Box::new(Box::new(
        RedisAdapter::new(args.redis_url).await.unwrap(),
    )));
    let route_repository: &mut Box<dyn RouteRepository> =
        Box::leak(Box::new(Box::new(RouteRepositoryImpl::new(redis_adapter))));

    let route_source = Box::leak(Box::new(RouteSource::new(redis_adapter)));
    let socket_adapter = SocketAdapter::new(connection_manager, route_repository);
    join_all(vec![tokio::spawn(async {
        socket_adapter.start_listening(args.listen_url).await;
    })])
    .await;

    Ok(())
}
