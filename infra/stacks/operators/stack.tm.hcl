stack {
  name        = "Operators"
  description = "Stack containing the operators inside a kubernetes cluster, such as Redpanda operator, CockroachDB operator"
  id          = "5120d91b-2925-471c-93b7-4e3227a4039c"
  tags = [
    "operators"
  ]
  after = [
    "tag:platform"
  ]
}

globals "dependencies" {
  platform = true
}

