resource "kubernetes_namespace" "ingress-nginx-namespace" {
  metadata {
    name = "ingress-nginx"
  }
}

resource "helm_release" "nginx_ingress" {
  depends_on = [ kubernetes_namespace.ingress-nginx-namespace ]
  name       = "nginx-ingress-controller"

  repository = "https://charts.bitnami.com/bitnami"
  chart      = "nginx-ingress-controller"

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
