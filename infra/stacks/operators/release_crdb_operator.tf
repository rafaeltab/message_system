resource "helm_release" "crdb_operator" {
  depends_on = [helm_release.nginx_ingress]
  chart      = "./charts/cockroach-operator"
  name       = "crdb-operator"
}
