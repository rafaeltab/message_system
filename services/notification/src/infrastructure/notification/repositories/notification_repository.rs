use tonic::async_trait;

use crate::{
    domain::{
        notification::{
            aggregates::notification::Notification, exceptions::send_error::SendError,
            repositories::notification_repository::NotificationRepository,
        },
        route::repositories::route_repository::RouteRepository,
    },
    ports::notification_port::NotificationSink,
};

pub struct NotificationRepositoryImpl<'a> {
    route_repository: &'a dyn RouteRepository,
    notification_sink: &'a dyn NotificationSink,
}

impl<'a> NotificationRepositoryImpl<'a> {
    pub fn new(
        route_repository: &'a dyn RouteRepository,
        notification_sink: &'a dyn NotificationSink,
    ) -> Self {
        NotificationRepositoryImpl {
            route_repository,
            notification_sink,
        }
    }
}

#[async_trait]
impl<'a> NotificationRepository for NotificationRepositoryImpl<'a> {
    async fn send_notification(&self, notification: Notification) -> Result<(), SendError> {
        let res = self
            .route_repository
            .get_route(notification.get_user_id())
            .await;

        if let Err(_) = res {
            return Err(SendError::ClientNotFound);
        }

        let route = res.unwrap();

        if *route.is_local() {
            self.notification_sink.send_notification(notification).await;
            return Ok(());
        }

        todo!()
    }
}
