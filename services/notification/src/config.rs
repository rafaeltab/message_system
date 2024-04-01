use serde::Deserialize;
use serde_yaml::from_str;
use std::{
    fs::File,
    io::{Error, Read},
};

#[derive(Deserialize, Debug)]
pub struct AppConfig {
    pub redis: RedisConfig,
    pub kafka: KafkaConfig,
    pub web_socket: WebSocketConfig,
    pub grpc: GrpcConfig,
    pub route: RouteConfig,
}

#[derive(Deserialize, Debug)]
pub struct RedisConfig {
    pub url: String,
}

#[derive(Deserialize, Debug)]
pub struct WebSocketConfig {
    pub url: String,
}

#[derive(Deserialize, Debug)]
pub struct GrpcConfig {
    pub url: String,
}

#[derive(Deserialize, Debug)]
pub struct RouteConfig {
    pub url: String,
}

#[derive(Deserialize, Debug, Clone)]
pub struct KafkaConfig {
    pub brokers: Vec<String>,
    pub group_id: String,
    pub topics: Vec<String>,
    pub workers: i32,
    pub sasl: Option<KafkaSaslConfig>,
}

#[derive(Deserialize, Debug, Clone)]
pub struct KafkaSaslConfig {
    pub mechanism: String,
    pub username: String,
    pub password: String,
}

impl KafkaConfig {
    pub fn get_kafka_brokers(&self) -> String {
        self.brokers.join(",")
    }
    pub fn get_kafka_topics(&self) -> Vec<&str> {
        self.topics.iter().map(|s| s.as_str()).collect::<Vec<_>>()
    }
}

pub fn load_config(config_path: String) -> Result<AppConfig, Box<dyn std::error::Error>> {
    let mut file = match File::open(config_path) {
        Ok(val) => Ok(val),
        Err(err) => Err(Error::new(err.kind(), "Unable to read configuration file")),
    }?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    let config: AppConfig = from_str(&contents)?;
    Ok(config)
}
