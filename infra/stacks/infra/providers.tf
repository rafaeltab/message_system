terraform {
  required_providers {
    kubernetes = {
      source = "hashicorp/kubernetes"
    }
  }
}

provider "kubernetes" {
  host = data.terraform_remote_state.platform.outputs.kubernetes_connection.host

  client_certificate     = data.terraform_remote_state.platform.outputs.kubernetes_connection.client_certificate
  client_key             = data.terraform_remote_state.platform.outputs.kubernetes_connection.client_key
  cluster_ca_certificate = data.terraform_remote_state.platform.outputs.kubernetes_connection.cluster_ca_certificate
}

