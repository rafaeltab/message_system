generate_hcl "_terramate_generated_backend.tf" {
  content {
    terraform {
      backend "local" {
        path = "/states/${terramate.stack.id}.tfstate"
      }
    }
  }
}

