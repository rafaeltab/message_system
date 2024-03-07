use std::{error::Error, sync::Arc};

use log::info;
use tonic::transport::Server;

use crate::{adapters::tonic::notification_service::notification_proto, ports::notification_port::NotificationSource};

use super::tonic::notification_service::{
    notification_proto::notification_server::NotificationServer, NotificationService,
};

pub struct TonicSourceAdapter {
    notification_source: Arc<&'static NotificationSource<'static>>,
}

impl TonicSourceAdapter {
    pub fn new(notification_source: &'static NotificationSource) -> Self {
        TonicSourceAdapter {
            notification_source: Arc::new(notification_source),
        }
    }

    pub async fn start_listening(&self, addr: String) -> Result<(), Box<dyn Error>> {
        let notification_service = NotificationService::new(Arc::clone(&self.notification_source));

        let reflection_service = tonic_reflection::server::Builder::configure()
            .register_encoded_file_descriptor_set(notification_proto::FILE_DESCRIPTOR_SET)
            .build()?;

        info!("gRPC listening on: {}", addr);
        Server::builder()
            .add_service(reflection_service)
            .add_service(NotificationServer::new(notification_service))
            .serve(addr.parse()?)
            .await?;

        Ok(())
    }
}
