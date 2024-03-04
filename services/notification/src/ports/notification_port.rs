use async_trait::async_trait;

use crate::domain::notification::aggregates::notification::Notification;

#[async_trait]
pub trait NotificationSink {
    async fn send_notification(&self, notification: Notification);
}

pub struct NotificationSource {

}

impl NotificationSource {
    pub fn send_notification(&self, id: &i64, message: String) -> Result<(), ()> {
        todo!()
    }
}
