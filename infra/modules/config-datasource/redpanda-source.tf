data "kubernetes_config_map" "redpanda-rpk" {
  metadata {
    name      = "redpanda-rpk"
    namespace = "default"
  }
}

locals {
  redpanda_profile  = yamldecode(data.kubernetes_config_map.redpanda-rpk.data["profile"])
}

output "redpanda" {
  value = {
    brokers = yamldecode(data.kubernetes_config_map.redpanda-rpk.data["profile"]).kafka_api.brokers
    admin = yamldecode(data.kubernetes_config_map.redpanda-rpk.data["profile"]).admin_api.addresses
    ca_crt = data.kubernetes_secret.redpanda_external_root_certificate.data["ca.crt"]
    tls_crt = data.kubernetes_secret.redpanda_external_root_certificate.data["tls.crt"]
    tls_key = data.kubernetes_secret.redpanda_external_root_certificate.data["tls.key"]
  }
}

data "kubernetes_secret" "redpanda_external_root_certificate" {
  metadata {
    name      = "redpanda-external-root-certificate"
    namespace = "default"
  }
}

terraform {
  required_providers {
    kubernetes = {
      source = "hashicorp/kubernetes"
    }
  }
}
