use crate::domain::notification::{aggregates::notification::Notification, exceptions::send_error::SendError};

pub trait NotificationRepository {
    fn send_notification(notification: Notification) -> Result<(), SendError>;
}
