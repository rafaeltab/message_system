pub struct Route {
    id: i64,
    server: String 
}

impl Route {
    pub fn new(id: &i64, server: String) -> Route {
        Route {
            id: id.clone(),
            server
        }
    }

    pub fn get_id(&self) -> &i64 {
        &self.id
    }

    pub fn get_server(&self) -> &String {
        &self.server
    }
}
