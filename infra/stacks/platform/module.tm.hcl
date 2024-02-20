generate_hcl "platform.tf" {
  content {
    module "platform" {
      source = "./${global.platform}"
    }

    output "kubernetes_connection" {
      value = module.platform.kubernetes_connection
      sensitive = true
    }
  }
}
