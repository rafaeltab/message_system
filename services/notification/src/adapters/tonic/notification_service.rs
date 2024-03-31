use std::sync::Arc;

use log::{info, warn};
use notification_proto::notification_server::Notification;
use tonic::Code;

use crate::ports::notification_port::NotificationSource;

pub mod notification_proto {
    tonic::include_proto!("notification");

    pub(crate) const FILE_DESCRIPTOR_SET: &[u8] =
        tonic::include_file_descriptor_set!("notification_descriptor");
}

pub struct NotificationService {
    notification_source: Arc<NotificationSource>,
}

impl NotificationService {
    pub fn new(notification_source: Arc<NotificationSource>) -> Self {
        NotificationService {
            notification_source,
        }
    }
}

#[tonic::async_trait]
impl Notification for NotificationService {
    async fn send_notification(
        &self,
        request: tonic::Request<notification_proto::SendNotificationRequest>,
    ) -> Result<tonic::Response<notification_proto::SendNotificationResponse>, tonic::Status> {
        let input = request.get_ref();
        info!(id = input.id; "Sending notification from gRPC");

        match self
            .notification_source
            .send_notification(&input.id, input.notification.clone())
            .await
        {
            Ok(_) => Ok(tonic::Response::new(
                notification_proto::SendNotificationResponse {},
            )),
            Err(err) => {
                warn!(id = input.id, err = err, notification_length = input.notification.len(); "Error while sending notification from gRPC");
                Err(tonic::Status::new(
                    Code::Internal,
                    "An internal error occurred",
                ))
            }
        }
    }
}
