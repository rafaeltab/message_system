resource "kubernetes_deployment" "message-deployment" {
  metadata {
    name = "message-service-deployment"
    labels = {
      app   = "message-service"
      group = "message-system"
    }
  }
  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "message-service-pod"
      }
    }
    template {
      metadata {
        labels = {
          app   = "message-service-pod"
          group = "message-system"
        }
      }
      spec {
        container {
          name              = "message-service-container"
          image             = "rafaeltab/message-service"
          image_pull_policy = "Never"
          # command = ["sleep", "infinity"]
          port {
            name           = "websocket"
            container_port = 4000
          }
          volume_mount {
            name       = "config"
            mount_path = "/app/services/message/config/"
          }
        }
        volume {
          name = "config"
          projected {
            sources {
              secret {
                name = "redpanda-default-root-certificate"
              }
              secret {
                name = kubernetes_secret.message-config.metadata[0].name
              }
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "message-service" {
  metadata {
    name = "message-service-service"
    labels = {
      app   = "message-service"
      group = "message-system"
    }
  }
  spec {
    type = "LoadBalancer"
    selector = {
      app = "message-service-pod"
    }
    port {
      name        = "websocket"
      protocol    = "TCP"
      port        = 4000
      target_port = 4000
    }
  }
}

resource "kubernetes_secret" "message-config" {
  metadata {
    name      = "message-service-config-kafka"
    namespace = "default"
  }
  data = {
    "kafka.json" = jsonencode(var.MESSAGE_CONFIG_KAFKA)
  }
}

variable "MESSAGE_CONFIG_KAFKA" {
  type = object({
    bootstrap = object({
      server = string
    })
    key    = optional(string)
    secret = optional(string)
  })
}

resource "kubernetes_manifest" "message-topic" {
  depends_on = [helm_release.redpanda-controller]
  manifest = {
    apiVersion = "cluster.redpanda.com/v1alpha1"
    kind       = "Topic"
    metadata = {
      name      = "message"
      namespace = "default"
    }
    spec = {
      partitions        = 9,
      replicationFactor = 1,
      kafkaApiSpec = {
        brokers = [
          "redpanda-0.redpanda.default.svc.cluster.local:9093",
          "redpanda-1.redpanda.default.svc.cluster.local:9093",
          "redpanda-2.redpanda.default.svc.cluster.local:9093"
        ]
      }
    }
  }
}
