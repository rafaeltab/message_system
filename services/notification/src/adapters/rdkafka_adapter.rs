use std::sync::Arc;

use futures_util::{stream::FuturesUnordered, StreamExt, TryStreamExt};
use rdkafka::{
    consumer::{Consumer, StreamConsumer},
    error::KafkaError,
    message::BorrowedMessage,
    ClientConfig, Message,
};

use crate::ports::notification_port::NotificationSource;

#[derive(Copy, Clone)]
pub struct RdkafkaConfig<'a> {
    pub brokers: &'a str,
    pub group_id: &'a str,
    pub topics: &'a [&'a str],
    pub workers: i32,
}

pub struct RdkafkaAdapter {
    notification_source: Arc<NotificationSource>,
}

impl RdkafkaAdapter {
    pub fn new(notification_source: Arc<NotificationSource>) -> Self {
        RdkafkaAdapter {
            notification_source,
        }
    }

    pub async fn start_listening(self: Arc<Self>, config: RdkafkaConfig<'static>) {
        (0..config.workers)
            .into_iter()
            .map(|_| {
                let self_clone = Arc::clone(&self);
                tokio::spawn(async move {
                    self_clone.listen_once(config.clone()).await;
                })
            })
            .collect::<FuturesUnordered<_>>()
            .for_each(|_| async { () })
            .await;
    }

    async fn listen_once<'a>(&self, config: RdkafkaConfig<'a>) {
        let consumer: StreamConsumer = ClientConfig::new()
            .set("group.id", config.group_id)
            .set("bootstrap.servers", config.brokers)
            .set("enable.partition.eof", "false")
            .set("session.timeout.ms", "6000")
            .set("enable.auto.commit", "false")
            .create()
            .expect("Consumer creation failed");

        consumer
            .subscribe(config.topics)
            .expect("Can't subscribe to topics");

        consumer
            .stream()
            .try_for_each(
                |borrowed_message| async move { self.handle_message(borrowed_message).await },
            )
            .await
            .expect("Stream processing failed");
    }

    async fn handle_message(
        &self,
        borrowed_message: BorrowedMessage<'_>,
    ) -> Result<(), KafkaError> {
        let key = borrowed_message
            .key_view::<str>()
            .expect("No key provided")
            .expect("Key was not a utf-8 string")
            .parse::<i64>()
            .expect("Key was not an integer");
        let message = borrowed_message
            .payload_view::<str>()
            .expect("No payload provided")
            .expect("Payload was not a utf-8 string");

        let _ = self.notification_source
            .send_notification(&key, message.to_string())
            .await;
        Ok(())
    }
}
