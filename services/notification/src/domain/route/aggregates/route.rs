pub struct Route {
    server: String,
    is_local: bool
}

impl Route {
    pub fn new(server: String, is_local: bool) -> Route {
        Route {
            server,
            is_local
        }
    }

    pub fn get_server(&self) -> &String {
        &self.server
    }

    pub fn is_local(&self) -> &bool {
        &self.is_local
    }
}
