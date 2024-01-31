# resource "kubernetes_deployment" "socket-deployment" {
#     metadata {
#         name = "socket-service-deployment"
#         labels = {
#             app= "socket-service"
#             group= "message-system"
#         }
#     }
# spec {
#   replicas = 1
#   selector {
#     match_labels = {
#       app= "socket-service-pod"
#     }
#   }
#   template{
#     metadata {
#       labels = {
#         app = "socket-service-pod"
#         group = "message-system"
#       }
#     }
#     spec {
#       container {
#         name = "socket-service-container"
#           image= "rafaeltab/socket-service"
#           image_pull_policy= "Never"
#           port {
#             name= "websocket"
#             container_port= 3000
#           }
#         }
#       }
#     }
#   }
# }
#
# resource "kubernetes_service" "socket-service" {
#   metadata {
#     name= "socket-service-service"
#     labels = {
#       app= "socket-service"
#       group = "message-system"
#     }
#   }
# spec {
#   type= "ClusterIP"
#   selector = {
#     app= "socket-service-pod"
#   }
#   port {
#     name= "websocket"
#       protocol= "TCP"
#       port= 3000
#       target_port= 3000
#     }
#   }
# }
#
# resource "kubernetes_ingress_v1" "socket-ingress" {
#   metadata {
#     name = "socket-service-ingress"
#     annotations = {
#       "nginx.ingress.kubernetes.io/proxy-read-timeout"= "3600"
#       "nginx.ingress.kubernetes.io/proxy-send-timeout"= "3600"
#     }
#   }
#   spec {
#     ingress_class_name = "nginx"
#     rule {
#       host = "localhost"
#       http {
#         path {
#           path = "/ws/"
#           path_type = "Prefix"
#           backend {
#             service {
#               name = "socket-service-service"
#               port {
#                 number = 3000
#               }
#             }
#           }
#         }
#       }
#     }
#   }
# }
