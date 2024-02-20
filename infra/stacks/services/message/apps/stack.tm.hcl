stack {
  name        = "Message Service Application"
  description = "Stack containing the applications in a kubernetes cluster for the message service"
  id          = "5e9c65cc-c537-403d-9115-d175ba41c8b6"
  tags = [
    "app",
    "message-service"
  ]
  after = [
    "tag:config"
  ]
}
