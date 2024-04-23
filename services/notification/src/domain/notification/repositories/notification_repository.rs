use tonic::async_trait;

use crate::domain::notification::{aggregates::notification::Notification, exceptions::send_error::SendError};

#[async_trait]
pub trait NotificationRepository: Send + Sync {
    async fn send_notification(&self, notification: Notification) -> Result<SendResult, SendError>;
}

pub enum SendResult {
    NotificationSent,
    ClientNotConnected,
}
