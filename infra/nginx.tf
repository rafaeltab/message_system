resource "helm_release" "nginx_ingress" {
  name       = "nginx-ingress-controller"

  repository = "https://charts.bitnami.com/bitnami"
  chart      = "nginx-ingress-controller"

  namespace = "ingress-nginx"
  create_namespace = true 

  set {
    name = "tcp.26257"
    value = "default/cockroachdb-public:26257"
  }

  set {
    name = "service.ports.proxied-tcp-26256"
    value = 26257
  }

  set {
    name = "namespaceOverride"
    value = "ingress-nginx"
  }
}
