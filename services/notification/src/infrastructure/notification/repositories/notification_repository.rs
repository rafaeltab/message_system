use std::sync::Arc;

use log::info;
use tonic::async_trait;

use crate::{
    domain::{
        notification::{
            aggregates::notification::Notification, exceptions::send_error::SendError,
            repositories::notification_repository::NotificationRepository,
            repositories::notification_repository::SendResult,
        },
        route::repositories::route_repository::RouteRepository,
    },
    ports::{
        notification_forward_port::NotificationForwardSink, notification_port::NotificationSink,
    },
};

pub struct NotificationRepositoryImpl {
    route_repository: Arc<dyn RouteRepository>,
    notification_sink: Arc<dyn NotificationSink>,
    notification_forward_sink: Arc<dyn NotificationForwardSink>,
}

impl NotificationRepositoryImpl {
    pub fn new(
        route_repository: Arc<dyn RouteRepository>,
        notification_sink: Arc<dyn NotificationSink>,
        notification_forward_sink: Arc<dyn NotificationForwardSink>,
    ) -> Self {
        NotificationRepositoryImpl {
            route_repository,
            notification_sink,
            notification_forward_sink,
        }
    }
}

#[async_trait]
impl NotificationRepository for NotificationRepositoryImpl {
    async fn send_notification(&self, notification: Notification) -> Result<SendResult, SendError> {
        let res = self
            .route_repository
            .get_route(notification.get_user_id())
            .await;

        if res.is_err() {
            return Err(SendError::UnableToSend);
        }

        let result = res.unwrap();
        if result.is_none() {
            return Ok(SendResult::ClientNotConnected);
        }

        let route = result.unwrap();

        if *route.is_local() {
            self.notification_sink.send_notification(notification).await;
            return Ok(SendResult::NotificationSent);
        }

        info!(route = route.get_server(); "Route not found locally, forwarding notification");

        match self
            .notification_forward_sink
            .forward_notification(notification, route)
            .await
        {
            Ok(_) => Ok(SendResult::NotificationSent),
            Err(_) => Err(SendError::UnableToSend),
        }
    }
}
