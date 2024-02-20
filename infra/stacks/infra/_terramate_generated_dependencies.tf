// TERRAMATE: GENERATED AUTOMATICALLY DO NOT EDIT

data "terraform_remote_state" "crds" {
  backend = "local"
  config = {
    path = "/states/0ac2a002-9489-4370-9373-db7dd5f124a2.tfstate"
  }
}
data "terraform_remote_state" "operators" {
  backend = "local"
  config = {
    path = "/states/5120d91b-2925-471c-93b7-4e3227a4039c.tfstate"
  }
}
data "terraform_remote_state" "platform" {
  backend = "local"
  config = {
    path = "/states/d39890fa-5d04-4bab-be71-44bd7a1d08eb.tfstate"
  }
}
