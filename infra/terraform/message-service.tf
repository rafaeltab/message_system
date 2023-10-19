resource "kubernetes_deployment" "message-deployment" {
    metadata {
        name = "message-service-deployment"
        labels = {
            app= "message-service"
            group= "message-system"
        }
    }
spec {
  replicas = 1
  selector {
    match_labels = {
      app= "message-service-pod"
    }
  }
  template{
    metadata {
      labels = {
        app = "message-service-pod"
        group = "message-system"
      }
    }
    spec {
      container {
        name = "message-service-container"
          image= "rafaeltab/message-service"
          image_pull_policy= "Never"
          port {
            name= "websocket"
            container_port= 4000
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "message-service" {
  metadata {
    name= "message-service-service"
    labels = {
      app= "message-service"
      group = "message-system"
    }
  }
spec {
  type= "LoadBalancer"
  selector = {
    app= "message-service-pod"
  }
  port {
    name= "websocket"
      protocol= "TCP"
      port= 4000
      target_port= 4000
    }
  }
}

