use std::sync::Arc;

use async_trait::async_trait;

use crate::{
    domain::route::{
        aggregates::route::Route,
        exceptions::{create_error::CreateError, delete_error::DeleteError, get_error::GetError},
        repositories::route_repository::RouteRepository,
    },
    ports::route_port::RouteSink,
};

pub struct RouteRepositoryImpl<'a> {
    route_sink: Arc<&'a Box<dyn RouteSink>>,
}

impl<'a> RouteRepositoryImpl<'a> {
    pub fn new(route_sink: &'a Box<dyn RouteSink>) -> Self {
        RouteRepositoryImpl {
            route_sink: Arc::new(route_sink)
        }
    }
}

#[async_trait]
impl<'a> RouteRepository for RouteRepositoryImpl<'a> {
    async fn get_route(&self, id: &i64) -> Result<Route, GetError> {
        match self.route_sink.get_route(*id).await {
            Ok(val) => Ok(Route::new(id, val)),
            Err(_) => Err(GetError::Unknown),
        }
    }

    async fn create_route(&self, id: &i64) -> Result<Route, CreateError> {
        let route = "";
        match self.route_sink.save_route(*id, route.to_string()).await {
            Ok(_) => Ok(Route::new(id, route.to_string())),
            Err(_) => Err(CreateError::Unknown)
        }
    }

    async fn delete_route(&self, id: &i64) -> Result<(), DeleteError> {
        match self.route_sink.delete_route(*id).await {
            Ok(_) => Ok(()),
            Err(_) => Err(DeleteError::Unknown)
        }
    }
}
