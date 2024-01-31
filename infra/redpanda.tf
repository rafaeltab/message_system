resource "helm_release" "redpanda-controller" {
  name             = "redpanda-controller"
  repository       = "https://charts.redpanda.com"
  chart            = "operator"
  namespace        = "redpanda"
  create_namespace = true
}

resource "kubernetes_manifest" "redpanda-resource" {
  depends_on = [helm_release.redpanda-controller]
  manifest = {
    apiVersion = "cluster.redpanda.com/v1alpha1"
    kind       = "Redpanda"
    metadata = {
      name      = "redpanda"
      namespace = "redpanda"
    }
    spec = {
      chartRef = {}
      clusterSpec = {
        external = {
          domain = "customredpandadomain.local"
        }
        statefulset = {
          initContainers = {
            setDataDirOwnership = {
              enabled = true
            }
          }
          replicas = 3
        }
      }
    }
  }
}
