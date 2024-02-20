terraform {
  required_providers {
    kubernetes = {
      source = "hashicorp/kubernetes"
    }
    kafka = {
      source = "Mongey/kafka"
    }
  }
}

provider "kubernetes" {
  host = data.terraform_remote_state.platform.outputs.kubernetes_connection.host

  client_certificate     = data.terraform_remote_state.platform.outputs.kubernetes_connection.client_certificate
  client_key             = data.terraform_remote_state.platform.outputs.kubernetes_connection.client_key
  cluster_ca_certificate = data.terraform_remote_state.platform.outputs.kubernetes_connection.cluster_ca_certificate
}

module "redpanda" {
  source = "../../../../modules/config-datasource"
  providers = {
    kubernetes = kubernetes
  }
}

provider "kafka" {
  bootstrap_servers = module.redpanda.redpanda.brokers
  # bootstrap_servers = ["redpanda-0.redpanda.local:31092"]
  ca_cert           = module.redpanda.redpanda.ca_crt
  client_cert       = module.redpanda.redpanda.tls_crt
  client_key        = module.redpanda.redpanda.tls_key
}


resource "kafka_topic" "logs" {
  name               = "systemd_logs"
  replication_factor = 1
  partitions         = 100
}
