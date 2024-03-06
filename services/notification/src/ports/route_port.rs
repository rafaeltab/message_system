use std::sync::Arc;

use async_trait::async_trait;

#[async_trait]
pub trait RouteSink: Send + Sync {
    async fn save_route(&self, id: i64, route: String) -> Result<(), ()>;
    async fn get_route(&self, id: i64) -> Result<String, ()>;
    async fn delete_route(&self, id: i64) -> Result<(), ()>;
}

pub struct RouteSource<'a> {
    route_sink: Arc<&'a Box<dyn RouteSink>>,
}

impl<'a> RouteSource<'a> {
    pub fn new(route_sink: &'a Box<dyn RouteSink>) -> Self {
        RouteSource {
            route_sink: Arc::new(route_sink),
        }
    }

    pub async fn del_route(&self, id: i64) -> Result<(), ()> {
        let _res = self.route_sink.delete_route(id).await?;
        Ok(())
    }

    pub async fn add_route(&self, id: i64, route: String) -> Result<(), ()> {
        let _res = self.route_sink.save_route(id, route).await?;
        Ok(())
    }
}
