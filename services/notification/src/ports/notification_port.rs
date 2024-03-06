use async_trait::async_trait;
use std::error::Error;

use crate::domain::notification::{
    aggregates::notification::Notification,
    repositories::notification_repository::NotificationRepository,
};

#[async_trait]
pub trait NotificationSink: Sync + Send {
    async fn send_notification(&self, notification: Notification);
}

#[async_trait]
pub trait LocalNotificationSink: Sync + Send {
    async fn has_local_connection(&self, id: i64) -> Result<bool, Box<dyn Error + Send + Sync>>;
}

pub struct NotificationSource<'a> {
    notification_repository: &'a dyn NotificationRepository,
}

impl<'a> NotificationSource<'a> {
    pub fn new(notification_repository: &'a dyn NotificationRepository) -> Self {
        NotificationSource {
            notification_repository,
        }
    }

    pub async fn send_notification(&self, id: &i64, message: String) -> Result<(), ()> {
        match self
            .notification_repository
            .send_notification(Notification::new(id, message))
            .await
        {
            Ok(_) => Ok(()),
            Err(_) => Err(()),
        }
    }
}
