stack {
  name        = "CRDs"
  description = "Stack containing the Custom Resource Definitions needed for kubernetes clusters"
  id          = "0ac2a002-9489-4370-9373-db7dd5f124a2"
  after = [
    "tag:platform"
  ]
}

globals "dependencies" {
  platform = true
}

