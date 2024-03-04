mod adapters;
mod connection_manager;
mod domain;
mod ports;
use std::io::Error;

use adapters::socket_adapter::SocketAdapter;
use connection_manager::ConnManager;
use ports::route_port::RouteSource;
use simple_logger::SimpleLogger;
use tokio::main;

#[main]
async fn main() -> Result<(), Error> {
    SimpleLogger::new()
        .with_level(log::LevelFilter::Info)
        .init()
        .unwrap();

    let connection_manager = ConnManager::new();
    let route_source = RouteSource::new();
    let socket_adapter = SocketAdapter::new(Box::new(connection_manager), route_source);
    tokio::spawn(async {
        socket_adapter.start_listening().await;
    });
    Ok(())
}
