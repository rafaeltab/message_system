use async_trait::async_trait;

use crate::domain::route::{
    exceptions::{create_error::CreateError, delete_error::DeleteError},
    repositories::route_repository::RouteRepository,
};

#[async_trait]
pub trait RouteSink: Send + Sync {
    async fn save_route(&self, id: i64, route: String) -> Result<(), ()>;
    async fn get_route(&self, id: i64) -> Result<String, ()>;
    async fn delete_route(&self, id: i64) -> Result<(), ()>;
}

pub struct RouteSource<'a> {
    route_repository: &'a dyn RouteRepository,
}

impl<'a> RouteSource<'a> {
    pub fn new(route_repository: &'a dyn RouteRepository) -> Self {
        RouteSource {
            route_repository,
        }
    }

    pub async fn del_route(&self, id: i64) -> Result<(), DeleteError> {
        let _res = self.route_repository.delete_route(&id).await?;
        Ok(())
    }

    pub async fn add_route(&self, id: i64) -> Result<(), CreateError> {
        let _res = self.route_repository.create_route(&id).await?;
        Ok(())
    }
}
