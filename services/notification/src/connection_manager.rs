use std::{collections::HashMap, error::Error, sync::Arc};

use async_trait::async_trait;
use futures_util::{stream::SplitSink, SinkExt};
use tokio::{net::TcpStream, sync::Mutex};
use tokio_tungstenite::{tungstenite::Message, WebSocketStream};

use crate::ports::notification_port::LocalNotificationSink;

#[async_trait]
pub trait ConnectionManager: Send + Sync {
    async fn add_connection(
        &self,
        id: i64,
        writer: SplitSink<WebSocketStream<TcpStream>, Message>,
    ) -> Result<(), SplitSink<WebSocketStream<TcpStream>, Message>>;
    async fn send_message(&self, id: i64, message: Message) -> bool;
    async fn remove_connection(&self, id: i64);
}

pub struct ConnManager {
    pub connections: Arc<Mutex<HashMap<i64, SplitSink<WebSocketStream<TcpStream>, Message>>>>,
}

impl ConnManager {
    pub fn new() -> Self {
        Self {
            connections: Arc::new(Mutex::new(HashMap::new())),
        }
    }
}

#[async_trait]
impl ConnectionManager for ConnManager {
    async fn add_connection(
        &self,
        id: i64,
        writer: SplitSink<WebSocketStream<TcpStream>, Message>,
    ) -> Result<(), SplitSink<WebSocketStream<TcpStream>, Message>> {
        let mut connections = self.connections.lock().await;
        if connections.contains_key(&id) {
            return Err(writer);
        }

        connections.insert(id, writer);
        Ok(())
    }

    async fn send_message(&self, id: i64, message: Message) -> bool {
        if let Some(stream) = self.connections.lock().await.get_mut(&id) {
            if let Err(e) = stream.send(message.clone()).await {
                eprintln!("Error sending message on stream {}: {:?}", id, e);
                return false;
            }
            true
        } else {
            eprintln!("Stream with ID {} not found", id);
            false
        }
    }

    async fn remove_connection(&self, id: i64) {
        let mut connections = self.connections.lock().await;
        if !connections.contains_key(&id) {
            return;
        }
        connections.remove(&id);
    }
}

#[async_trait]
impl LocalNotificationSink for ConnManager {
    async fn has_local_connection(&self, id: i64) -> Result<bool, Box<dyn Error + Send + Sync>> {
        let res = self.connections.lock().await.contains_key(&id);
        Ok(res)
    }
}
