use std::sync::Arc;

use async_trait::async_trait;

use crate::{
    domain::route::{
        aggregates::route::Route,
        exceptions::{create_error::CreateError, delete_error::DeleteError, get_error::GetError},
        repositories::route_repository::RouteRepository,
    },
    ports::{notification_port::LocalNotificationSink, route_port::RouteSink},
};

pub struct RouteRepositoryImpl {
    route_sink: Arc<dyn RouteSink>,
    local_notification_sink: Arc<dyn LocalNotificationSink>,
    route: String,
}

impl RouteRepositoryImpl {
    pub fn new(
        route_sink: Arc<dyn RouteSink>,
        route: String,
        local_notification_sink: Arc<dyn LocalNotificationSink>,
    ) -> Self {
        RouteRepositoryImpl {
            route_sink,
            local_notification_sink,
            route,
        }
    }
}

#[async_trait]
impl RouteRepository for RouteRepositoryImpl {
    async fn get_route(&self, id: &i64) -> Result<Route, GetError> {
        match self.local_notification_sink.has_local_connection(*id).await {
            Ok(true) => Ok(Route::new(self.route.clone(), true)),
            Ok(false) | Err(_) => match self.route_sink.get_route(*id).await {
                Ok(val) => {
                    // cool
                    let is_local = val == self.route;
                    Ok(Route::new(val, is_local))
                }
                Err(_) => Err(GetError::Unknown),
            },
        }
    }

    async fn create_route(&self, id: &i64) -> Result<Route, CreateError> {
        match self.route_sink.save_route(*id, self.route.clone()).await {
            Ok(_) => Ok(Route::new(self.route.clone(), true)),
            Err(_) => Err(CreateError::Unknown),
        }
    }

    async fn delete_route(&self, id: &i64) -> Result<(), DeleteError> {
        match self.route_sink.delete_route(*id).await {
            Ok(_) => Ok(()),
            Err(_) => Err(DeleteError::Unknown),
        }
    }
}
