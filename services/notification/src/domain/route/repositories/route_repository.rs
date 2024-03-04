use crate::domain::route::{aggregates::route::Route, exceptions::{create_error::CreateError, delete_error::DeleteError, get_error::GetError}};

pub trait RouteRepository {
    fn get_route(id: &i64) -> Result<Route, GetError>;
    fn create_route(id: &i64) -> Result<Route, CreateError>;
    fn delete_route(id: &i64) -> Result<Route, DeleteError>;
}
