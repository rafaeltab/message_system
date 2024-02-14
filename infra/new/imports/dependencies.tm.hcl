generate_hcl "_terramate_generated_dependencies.tf" {
  condition = tm_length(tm_try(global.dependencies, [])) > 0

  lets {
    dependencies           = tm_try(global.dependencies, {})
    available_dependencies = tm_try(global.available_dependencies, {})
    unknown_dependencies   = tm_setsubtract(tm_keys(let.dependencies), tm_keys(let.available_dependencies))

    active_dependencies = [
      for k, v in tm_try(global.dependencies, {}) : k if v
    ]
  }

  content {
    tm_dynamic "data" {
      for_each = let.active_dependencies
      labels   = ["terraform_remote_state", remote.value]
      iterator = remote

      content {
        backend = "local"
        config = {
          path = "/states/${global.available_dependencies[remote.value]}.tfstate"
        }

        depends_on = [
          null_resource.initial_deployment_trigger
        ]
      }
    }

    resource "null_resource" "initial_deployment_trigger" {}
  }
}
