resource "helm_release" "cert-manager" {
  name       = "cert-manager"

  repository = "https://charts.bitnami.com/bitnami"
  chart      = "cert-manager"

  create_namespace = true
  namespace        = "cert-manager"

  set {
    name = "installCRDs"
    value = true
  }
}
