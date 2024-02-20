locals {
  args = "--certificate-authority='./ca.crt' --client-certificate='./cc.crt' --client-key='./ck.crt' --server='${data.terraform_remote_state.platform.outputs.kubernetes_connection.host}'"
}

resource "null_resource" "apply_crd" {
  provisioner "local-exec" {
    command = <<EOT
      cleanup_files() {
        rm -f ./ca.crt ./cc.crt ./ck.crt
      }
      trap cleanup_files EXIT

      echo '${data.terraform_remote_state.platform.outputs.kubernetes_connection.cluster_ca_certificate}' > ./ca.crt
      echo '${data.terraform_remote_state.platform.outputs.kubernetes_connection.client_certificate}' > ./cc.crt
      echo '${data.terraform_remote_state.platform.outputs.kubernetes_connection.client_key}' > ./ck.crt
      ./generate.sh ${local.args}
    EOT
  }
}

