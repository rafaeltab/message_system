use std::{error::Error, str::FromStr};

use crate::{
    domain::{
        notification::aggregates::notification::Notification, route::aggregates::route::Route,
    },
    ports::notification_forward_port::NotificationForwardSink,
};
use async_trait::async_trait;
use log::{error, info};
use tonic::transport::Endpoint;

use super::tonic::notification_service::notification_proto::{
    notification_client::NotificationClient, SendNotificationRequest,
};

#[derive(Default)]
pub struct TonicSinkAdapter {}

#[async_trait]
impl NotificationForwardSink for TonicSinkAdapter {
    async fn forward_notification(
        &self,
        notification: Notification,
        route: Route,
    ) -> Result<(), Box<dyn Error>> {
        info!(id = notification.get_user_id(), route = route.get_server(); "Forwarding notification");
        let channel = match Endpoint::from_str(route.get_server())?.connect().await {
            Ok(chan) => Ok(chan),
            Err(err) => {
                error!("Unable to connect to route while forwarding notification");
                Err(err)
            }
        }?;

        let mut notification_client = NotificationClient::new(channel);

        let request = tonic::Request::new(SendNotificationRequest {
            id: *notification.get_user_id(),
            notification: notification.get_content().into(),
        });

        notification_client.send_notification(request).await?;

        info!(id = notification.get_user_id(), route = route.get_server(); "Forwarded notification");

        Ok(())
    }
}
