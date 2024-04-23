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
    async fn get_route(&self, id: &i64) -> Result<Option<Route>, GetError> {
        match self.local_notification_sink.has_local_connection(*id).await {
            Ok(true) => Ok(Some(Route::new(self.route.clone(), true))),
            Ok(false) | Err(_) => match self.route_sink.get_route(*id).await {
                Ok(val) => {
                    // TODO what to do if the local_notificaton_sink returns false on
                    // has_local_connection, but redis says it should be available locally
                    if val.is_none() {
                        return Ok(None);
                    };
                    let route = val.unwrap();

                    let is_local = route == self.route;
                    Ok(Some(Route::new(route, is_local)))
                }
                Err(_) => Err(GetError::Unknown),
            },
            // TODO handle error
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
