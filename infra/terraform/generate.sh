#!/bin/bash

VAL="$(kubectl get crds 2> /dev/null | grep "cockroach")"
if [[ ${#VAL} -gt 9 ]] ; then
    echo "Found cockroach"
else
    echo "Not Found cockroach"
    kubectl apply -f https://raw.githubusercontent.com/cockroachdb/cockroach-operator/v2.11.0/install/crds.yaml
fi
