resource "helm_release" "crdb_operator" {
    chart = "./charts/cockroach-operator"
    name = "crdb-operator"
}

resource "kubernetes_manifest" "crdbcluster_cockroachdb" {
    depends_on = [helm_release.crdb_operator, helm_release.nginx_ingress]
  manifest = {
    "apiVersion" = "crdb.cockroachlabs.com/v1alpha1"
    "kind" = "CrdbCluster"
    "metadata" = {
      "name" = "cockroachdb"
      "namespace" = "default"
    }
    "spec" = {
      "additionalLabels" = {
        "crdb" = "is-cool"
      }
      "dataStore" = {
        "pvc" = {
          "spec" = {
            "accessModes" = [
              "ReadWriteOnce",
            ]
            "resources" = {
              "requests" = {
                "storage" = "60Gi"
              }
            }
            "volumeMode" = "Filesystem"
          }
        }
      }
      "nodes" = 10
      "resources" = {
        "limits" = {
          "cpu" = 2
          "memory" = "16Gi"
        }
        "requests" = {
          "cpu" = "500m"
          "memory" = "2Gi"
        }
      }
      "cockroachDBVersion": "v23.1.4"
      "ingress" = {
        "ui"={
          "ingressClassName"= "nginx"
          "host"= "database.localhost"
        }
      }
    }
  }
}


// TODO automatically create the roach user with a password from the variables
// TODO add an ingress so the dashboard can be accessed
// TODO make sure the thing starts on first try, if at all possible
