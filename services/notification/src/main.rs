mod adapters;
mod connection_manager;
mod domain;
mod ports;
use std::io::Error;

use adapters::socket_adapter::SocketAdapter;
use connection_manager::{ConnManager, ConnectionManager};
use futures_util::future::join_all;
use ports::route_port::RouteSource;
use simple_logger::SimpleLogger;
use tokio::main;

#[main]
async fn main() -> Result<(), Error> {
    SimpleLogger::new()
        .with_level(log::LevelFilter::Info)
        .init()
        .unwrap();

    let connection_manager: &mut Box<dyn ConnectionManager> =
        Box::leak(Box::new(Box::new(ConnManager::new())));
    let route_source = Box::leak(Box::new(RouteSource::new()));
    let socket_adapter = SocketAdapter::new(connection_manager, route_source);
    let socket_adapter2 = SocketAdapter::new(connection_manager, route_source);
    join_all(vec![
        tokio::spawn(async {
            socket_adapter.start_listening("127.0.0.1:5001").await;
        }),
        tokio::spawn(async {
            socket_adapter2.start_listening("127.0.0.1:5002").await;
        }),
    ])
    .await;
    Ok(())
}
