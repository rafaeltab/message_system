pub struct Route {
    id: i64,
    server: String,
    is_local: bool
}

impl Route {
    pub fn new(id: &i64, server: String, is_local: bool) -> Route {
        Route {
            id: id.clone(),
            server,
            is_local
        }
    }

    pub fn get_id(&self) -> &i64 {
        &self.id
    }

    pub fn get_server(&self) -> &String {
        &self.server
    }

    pub fn is_local(&self) -> &bool {
        &self.is_local
    }
}
