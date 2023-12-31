terraform {
    required_providers {
        kubernetes = {
            source = "hashicorp/kubernetes"                        
        }
    }
}

provider "kubernetes" {
  config_path = "~/.kube/config"
  config_context = "docker-desktop"
}

provider "helm" {
    kubernetes {
        config_path = "~/.kube/config"
        config_context = "docker-desktop"
    }
}
