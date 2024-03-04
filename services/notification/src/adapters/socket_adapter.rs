use std::sync::Arc;

use async_trait::async_trait;
use futures_util::{SinkExt, StreamExt};
use log::info;
use tokio::net::{TcpListener, TcpStream};
use tokio_tungstenite::tungstenite::Message;

use crate::{
    connection_manager::ConnectionManager,
    domain::notification::aggregates::notification::Notification,
    ports::{notification_port::NotificationSink, route_port::RouteSource},
};

pub struct SocketAdapter<'a> {
    pub connection_manager: Arc<&'a Box<dyn ConnectionManager>>,
    pub route_source: Arc<&'a RouteSource>,
}

impl<'a> SocketAdapter<'a> {
    pub fn new(
        connection_manager: &'a Box<dyn ConnectionManager>,
        route_source: &'a RouteSource,
    ) -> &'static Self {
        Box::leak(Box::new(SocketAdapter {
            connection_manager: Arc::new(connection_manager),
            route_source: Arc::new(route_source),
        }))
    }

    pub async fn start_listening(&'static self, addr: &str) {
        let try_socket = TcpListener::bind(&addr).await;
        let listener = try_socket.expect("Failed to bind to socket");
        info!("Listening on: {}", addr);

        while let Ok((stream, _)) = listener.accept().await {
            tokio::spawn(async {
                self.accept_connection(stream).await;
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
            return;
        }

        let add_route_res = self.route_source.add_route().await;
        if let Err(_) = add_route_res {
            let _ = self.connection_manager
                .send_message(
                    id,
                    Message::Text("{\"message\": \"Failed to register\"}".to_string()),
                )
                .await;

            let _ = self.connection_manager.remove_connection(id);
        }

        while let Some(Ok(msg)) = reader.next().await {
            match msg {
                Message::Text(msg) => {
                    Self::handle_text_message(Arc::clone(&self.connection_manager), msg).await
                }
                Message::Binary(_) => (),
                Message::Ping(_) => (),
                Message::Pong(_) => (),
                Message::Close(_) => self.connection_manager.remove_connection(id).await,
                Message::Frame(_) => (),
            }
        }
    }

    async fn handle_text_message(
        connection_manager: Arc<&Box<dyn ConnectionManager>>,
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
impl<'a> NotificationSink for SocketAdapter<'a> {
    async fn send_notification(&self, notification: Notification) {
        self.connection_manager
            .send_message(
                notification.get_user_id().clone(),
                Message::Text(notification.get_content().to_owned()),
            )
            .await;
    }
}
