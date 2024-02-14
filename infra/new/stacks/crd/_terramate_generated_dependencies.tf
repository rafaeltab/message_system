// TERRAMATE: GENERATED AUTOMATICALLY DO NOT EDIT

data "terraform_remote_state" "platform" {
  backend = "local"
  config = {
    path = "/states/d39890fa-5d04-4bab-be71-44bd7a1d08eb.tfstate"
  }
  depends_on = [
    null_resource.initial_deployment_trigger,
  ]
}
resource "null_resource" "initial_deployment_trigger" {
}
