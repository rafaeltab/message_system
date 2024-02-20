// TERRAMATE: GENERATED AUTOMATICALLY DO NOT EDIT

module "platform" {
  source = "./minikube"
}
output "kubernetes_connection" {
  sensitive = true
  value     = module.platform.kubernetes_connection
}
