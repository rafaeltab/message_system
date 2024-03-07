use std::error::Error;

use async_trait::async_trait;

use crate::domain::{
    notification::aggregates::notification::Notification, route::aggregates::route::Route,
};

#[async_trait]
pub trait NotificationForwardSink: Sync + Send {
    async fn forward_notification(&self, notification: Notification, route: Route) -> Result<(), Box<dyn Error>>;
}
