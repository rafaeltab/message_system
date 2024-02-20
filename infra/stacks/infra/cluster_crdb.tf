resource "kubernetes_manifest" "crdbcluster_cockroachdb" {
  provider = kubernetes
  manifest = {
    "apiVersion" = "crdb.cockroachlabs.com/v1alpha1"
    "kind"       = "CrdbCluster"
    "metadata" = {
      "name"      = "cockroachdb"
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
                "storage" = "10Gi"
              }
            }
            "volumeMode" = "Filesystem"
          }
        }
      }
      "nodes" = 3
      "resources" = {
        "limits" = {
          "cpu"    = 2
          "memory" = "16Gi"
        }
        "requests" = {
          "cpu"    = "500m"
          "memory" = "2Gi"
        }
      }
      "cockroachDBVersion" : "v23.1.4"
      "ingress" = {
        "ui" = {
          "ingressClassName" = "nginx"
          "host"             = "database.localhost"
        },
        # "sql" = {
        #   "ingressClassName" = "nginx"
        #   "host" = "db-sql.localhost"
        # }
      }
    }
  }
}

# echo \"CREATE DATABASE message; CREATE USER message; GRANT ALL ON DATABASE message TO message;\" | kubectl exec -it cockroachdb-client-secure -- ./cockroach sql --host=cockroachdb-public --insecure

// TODO tls
// TODO automatically create the roach user with a password from the variables
