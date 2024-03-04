pub trait RouteSink {
    fn save_route() -> Result<(), ()>;
    fn get_route() -> Result<(), ()>;
}

pub struct RouteSource {
    
}

impl RouteSource {
    pub fn new() -> Self {
        RouteSource {}
    }

    pub async fn add_route(&self) -> Result<(), ()> {
        todo!()
    }
}

