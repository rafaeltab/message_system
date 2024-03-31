use async_trait::async_trait;
use std::{error::Error, sync::Arc};

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

pub struct NotificationSource {
    notification_repository: Arc<dyn NotificationRepository>,
}

impl NotificationSource {
    pub fn new(notification_repository: Arc<dyn NotificationRepository>) -> Self {
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
