use std::sync::Arc;

use futures_util::{stream::FuturesUnordered, StreamExt, TryStreamExt};
use log::info;
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
    pub sasl: Option<RdkafkaSaslConfig<'a>>,
}

#[derive(Copy, Clone)]
pub struct RdkafkaSaslConfig<'a> {
    pub mechanism: &'a str,
    pub username: &'a str,
    pub password: &'a str,
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
            .map(|i| {
                let self_clone = Arc::clone(&self);
                tokio::spawn(async move {
                    self_clone.listen_once(&i, config).await;
                })
            })
            .collect::<FuturesUnordered<_>>()
            .for_each(|_| async { })
            .await;
    }

    async fn listen_once<'a>(&self, worker_index: &i32, config: RdkafkaConfig<'a>) {
        let mut client_config = ClientConfig::new();
        client_config
            .set("group.id", config.group_id)
            .set("bootstrap.servers", config.brokers)
            .set("enable.partition.eof", "false")
            .set("session.timeout.ms", "6000")
            .set("enable.auto.commit", "false");

        if let Some(sasl) = config.sasl {
            info!(worker_index;"Configuring rdkafka with SASL");
            client_config
                .set("security.protocol", "SASL_PLAINTEXT")
                .set("sasl.mechanism", sasl.mechanism)
                .set("sasl.username", sasl.username)
                .set("sasl.password", sasl.password);
        }

        let consumer: StreamConsumer = client_config.create().expect("Consumer creation failed");

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
        let key: Vec<&str> = borrowed_message
            .key_view::<str>()
            .expect("No key provided")
            .expect("Key was not a utf-8 string")
            .split('-')
            .collect();

        if key.len() != 2 {
            return Ok(());
        }

        let user_a = key[0]
            .parse::<i64>()
            .expect("Key did not contain a number-number");

        let user_b = key[1]
            .parse::<i64>()
            .expect("Key did not contain a number-number");

        let message = borrowed_message
            .payload_view::<str>()
            .expect("No payload provided")
            .expect("Payload was not a utf-8 string");

        let _ = self
            .notification_source
            .send_notification(&user_a, message.to_string())
            .await;

        let _ = self
            .notification_source
            .send_notification(&user_b, message.to_string())
            .await;

        Ok(())
    }
}
