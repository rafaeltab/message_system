pub struct Notification {
    user_id: i64, 
    content: String
}

impl Notification {
    pub fn new(user_id: &i64, content: String) -> Notification {
        Notification {
            user_id: user_id.clone(),
            content
        }
    }

    pub fn get_user_id(&self) -> &i64 {
        &self.user_id
    }

    pub fn get_content(&self) -> &String {
        &self.content
    }
}


