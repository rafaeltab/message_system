stack {
  name        = "Infrastructure"
  description = "Stack containing the infrastructure inside a kubernetes cluster, such as Redpanda cluster, CockroachDB cluster, and other databasesOB"
  id          = "f18572cb-2783-489f-b4fb-48e10ec4f741"
  tags = [
    "infra"  
  ]
  after = [
    "tag:operators"
  ]
}

globals "dependencies" {
  platform = true
  crds = true
  operators = true
}

