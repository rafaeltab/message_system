use async_trait::async_trait;
use log::{info, warn};
use redis::{AsyncCommands, IntoConnectionInfo, RedisResult};

use crate::ports::route_port::RouteSink;

pub struct RedisAdapter {
    connection_manager: redis::aio::ConnectionManager,
}

impl RedisAdapter {
    pub async fn new<T>(connection_info: T) -> RedisResult<Self>
    where
        T: IntoConnectionInfo,
    {
        let client = redis::Client::open(connection_info)?;
        let conn_manager = redis::aio::ConnectionManager::new(client).await?;

        Ok(RedisAdapter {
            connection_manager: conn_manager,
        })
    }
}

#[async_trait]
impl RouteSink for RedisAdapter {
    async fn save_route(&self, id: i64, route: String) -> Result<(), ()> {
        info!(id;"Saving route");
        match self
            .connection_manager
            .clone()
            .set::<i64, String, ()>(id, route)
            .await
        {
            Ok(_) => Ok(()),
            Err(err) => {
                warn!(err:? = err, id; "Failed saving route");
                Err(())
            }
        }
    }

    // TODO use test containers to verify the different scenarios
    async fn get_route(&self, id: i64) -> Result<Option<String>, ()> {
        info!("Getting route {}", id);
        let exists = match self
            .connection_manager
            .clone()
            .exists::<i64, bool>(id)
            .await
        {
            Ok(val) => val,
            Err(err) => {
                warn!(err:? = err, id; "Failed checking if route exists");
                false
            }
        };

        if !exists {
            return Ok(None);
        }

        match self
            .connection_manager
            .clone()
            .get::<i64, Option<String>>(id)
            .await
        {
            Ok(val) => Ok(val),
            Err(err) => {
                warn!(err:? = err, id; "Failed getting route");
                Err(())
            }
        }
    }

    async fn delete_route(&self, id: i64) -> Result<(), ()> {
        info!("Deleting route {}", id);
        match self.connection_manager.clone().del::<i64, ()>(id).await {
            Ok(_) => Ok(()),
            Err(err) => {
                warn!(err:? = err, id; "Failed deleting route");
                Err(())
            }
        }
    }
}

#[cfg(test)]
#[path = "./redis_adapter_test.rs"]
mod redis_adapter_test;
