use async_trait::async_trait;

use crate::domain::route::{
    aggregates::route::Route,
    exceptions::{create_error::CreateError, delete_error::DeleteError, get_error::GetError},
};

#[async_trait]
pub trait RouteRepository: Send + Sync {
    async fn get_route(&self, id: &i64) -> Result<Route, GetError>;
    async fn create_route(&self, id: &i64) -> Result<Route, CreateError>;
    async fn delete_route(&self, id: &i64) -> Result<(), DeleteError>;
}
