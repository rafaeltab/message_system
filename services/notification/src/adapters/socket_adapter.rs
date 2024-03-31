use std::sync::Arc;

use async_trait::async_trait;
use futures_util::{SinkExt, StreamExt};
use log::{error, info};
use tokio::net::{TcpListener, TcpStream};
use tokio_tungstenite::tungstenite::Message;

use crate::{
    connection_manager::ConnectionManager,
    domain::notification::aggregates::notification::Notification,
    ports::{notification_port::NotificationSink, route_port::RouteSource},
};

pub struct SocketAdapter {
    pub connection_manager: Arc<dyn ConnectionManager>,
    pub route_source: Arc<RouteSource>,
}

impl SocketAdapter {
    pub fn new(
        connection_manager: Arc<dyn ConnectionManager>,
        route_source: Arc<RouteSource>,
    ) -> Self {
        SocketAdapter {
            connection_manager,
            route_source,
        }
    }

    pub async fn start_listening(self: Arc<Self>, addr: String) {
        let try_socket = TcpListener::bind(&addr).await;
        let listener = try_socket.expect("Failed to bind to socket");
        info!("Websocket listening on: {}", addr);


        while let Ok((stream, _)) = listener.accept().await {
            let self_clone = self.clone();
            tokio::spawn(async move {
                self_clone.accept_connection(stream).await;
            });
        }
    }

    async fn accept_connection(&self, stream: TcpStream) {
        let addr = stream
            .peer_addr()
            .expect("connected streams should have a peer address");
        info!("Peer address: {}", addr);

        let mut ws_stream = tokio_tungstenite::accept_async(stream)
            .await
            .expect("Error during the websocket handshake occurred");

        info!("New WebSocket connection: {}", addr);

        let res = ws_stream.next().await;
        if !matches!(res, Some(Ok(_))) {
            return;
        }

        let val = res.unwrap().unwrap();
        let text_result = val.into_text();
        if text_result.is_err() {
            return;
        };

        let text = text_result.unwrap();
        let parse_res = text.parse::<i64>();
        if parse_res.is_err() {
            return;
        }

        let id = parse_res.unwrap();
        let (mut writer, mut reader) = ws_stream.split();
        let _ = writer
            .send(Message::Text("{\"message\": \"Registed\"}".to_string()))
            .await;

        let add_result = self.connection_manager.add_connection(id, writer).await;

        // If an error occurs we take back ownership of the writer, and send a message indicating a
        // problem
        if let Err(mut err_writer) = add_result {
            let _ = err_writer
                .send(Message::Text(
                    "{\"message\": \"Failed to register\"}".to_string(),
                ))
                .await;
            error!(
                "{}",
                "Failed to register a client because the add_result had an error"
            );
            return;
        }

        let add_route_res = self.route_source.add_route(id).await;
        if let Err(_) = add_route_res {
            let _ = self
                .connection_manager
                .send_message(
                    id,
                    Message::Text("{\"message\": \"Failed to register\"}".to_string()),
                )
                .await;

            error!("Failed to register a client because adding the route to the source failed");

            self.connection_manager.remove_connection(id).await;
        }

        while let Some(Ok(msg)) = reader.next().await {
            match msg {
                Message::Text(msg) => {
                    Self::handle_text_message(Arc::clone(&self.connection_manager), msg).await
                }
                Message::Binary(_) => (),
                Message::Ping(_) => (),
                Message::Pong(_) => (),
                Message::Close(_) => {
                    let _ = self.route_source.del_route(id).await;
                    // TODO figure out what to do if we fail to delete from redis
                    self.connection_manager.remove_connection(id).await
                }
                Message::Frame(_) => (),
            }
        }
    }

    async fn handle_text_message(
        connection_manager: Arc<dyn ConnectionManager>,
        msg: String,
    ) {
        let parse_res = msg.parse::<i64>();
        if parse_res.is_err() {
            return;
        }

        let id = parse_res.unwrap();
        connection_manager
            .clone()
            .send_message(
                id,
                Message::Text("{\"message\": \"You received a message!\"}".to_string()),
            )
            .await;
    }
}

#[async_trait]
impl NotificationSink for SocketAdapter {
    async fn send_notification(&self, notification: Notification) {
        self.connection_manager
            .send_message(
                notification.get_user_id().clone(),
                Message::Text(notification.get_content().to_owned()),
            )
            .await;
    }
}
