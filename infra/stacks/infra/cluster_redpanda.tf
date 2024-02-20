resource "kubernetes_manifest" "redpanda-resource" {
  provider = kubernetes
  manifest = {
    apiVersion = "cluster.redpanda.com/v1alpha1"
    kind       = "Redpanda"
    metadata = {
      name      = "redpanda"
      namespace = "default"
    }
    spec = {
      chartRef = {}
      clusterSpec = {
        force = true,
        tls = {
          enabled = true
        }
        external = {
          enabled = true
          type    = "LoadBalancer"

          domain = "redpanda.local"
        }
        statefulset = {
          initContainers = {
            setDataDirOwnership = {
              enabled = true
            }
          }
          podAntiAffinity = {
            requiredDuringSchedulingIgnoredDuringExecution = [{
              labelSelector = {
                matchExpressions = [{
                  key      = "app.kubernetes.io/name"
                  operator = "In"
                  values   = ["redpanda"]
                  }
                ]
              }
              topologyKey = "kubernetes.io/hostname"
            }]
          }
          replicas = 3
        }
      }
    }
  }
}

