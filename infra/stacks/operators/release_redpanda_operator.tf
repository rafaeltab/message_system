resource "helm_release" "redpanda-controller" {
  name             = "redpanda-controller"
  repository       = "https://charts.redpanda.com"
  chart            = "operator"
  namespace        = "default"
}
