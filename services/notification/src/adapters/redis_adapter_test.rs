use redis::{Client, Commands};
use testcontainers::{clients::Cli, core::WaitFor, Container, GenericImage};

use crate::{adapters::redis_adapter::RedisAdapter, ports::route_port::RouteSink};

#[tokio::test]
async fn get_route_none() {
    let image = RedisImage::new();
    let container = image.start();
    let redis_adapter = container.create_redis_adapter().await;

    let get_route = redis_adapter.get_route(5).await.unwrap();
    assert_eq!(get_route, None);
}

#[tokio::test]
async fn get_route_some() {
    let image = RedisImage::new();
    let container = image.start();
    let mut redis_client = container.create_redis_client();
    let redis_adapter = container.create_redis_adapter().await;
    redis_client
        .set::<i64, String, ()>(5, "test".to_string())
        .unwrap();

    let get_route = redis_adapter.get_route(5).await.unwrap();
    assert_eq!(get_route, Some("test".to_string()));
}

#[tokio::test]
async fn save_route() {
    let image = RedisImage::new();
    let container = image.start();
    let mut redis_client = container.create_redis_client();
    let redis_adapter = container.create_redis_adapter().await;

    redis_adapter
        .save_route(5, "test".to_string())
        .await
        .unwrap();

    let val = redis_client.get::<i64, Option<String>>(5).unwrap();
    assert_eq!(val, Some("test".to_string()));
}

#[tokio::test]
async fn del_route() {
    let image = RedisImage::new();
    let container = image.start();
    let mut redis_client = container.create_redis_client();
    let redis_adapter = container.create_redis_adapter().await;

    redis_client
        .set::<i64, String, ()>(5, "test".to_string())
        .unwrap();
    redis_adapter.delete_route(5).await.unwrap();

    let val = redis_client.get::<i64, Option<String>>(5).unwrap();
    assert_eq!(val, None);
}

#[tokio::test]
async fn del_route_not_found() {
    let image = RedisImage::new();
    let container = image.start();
    let mut redis_client = container.create_redis_client();
    let redis_adapter = container.create_redis_adapter().await;
    redis_adapter.delete_route(5).await.unwrap();

    let val = redis_client.get::<i64, Option<String>>(5).unwrap();
    assert_eq!(val, None);
}

struct RedisImage {
    image: GenericImage,
    docker: Cli,
}

struct RedisContainer<'a> {
    container: Container<'a, GenericImage>,
}

impl RedisImage {
    fn new() -> Self {
        RedisImage {
            image: GenericImage::new("redis", "7.2.4")
                .with_exposed_port(6379)
                .with_wait_for(WaitFor::message_on_stdout("Ready to accept connections")),
            docker: Cli::default(),
        }
    }

    fn start(&self) -> RedisContainer {
        RedisContainer {
            container: self.docker.run(self.image.clone()),
        }
    }
}

impl<'a> RedisContainer<'a> {
    fn get_conn_string(&self) -> String {
        format!(
            "redis://localhost:{}",
            self.container.get_host_port_ipv4(6379),
        )
    }

    async fn create_redis_adapter(&self) -> RedisAdapter {
        RedisAdapter::new(self.get_conn_string()).await.unwrap()
    }

    fn create_redis_client(&self) -> Client {
        redis::Client::open(self.get_conn_string()).unwrap()
    }
}
