#!/bin/bash

VAL="$(kubectl get crds 2> /dev/null | grep "cockroach")"
if [[ ${#VAL} -gt 9 ]] ; then
    echo "Found cockroach"
else
    echo "Not Found cockroach"
    kubectl apply -f https://raw.githubusercontent.com/cockroachdb/cockroach-operator/v2.11.0/install/crds.yaml
fi

VAL="$(kubectl get crds 2> /dev/null | grep "redpanda")"
if [[ ${#VAL} -gt 9 ]] ; then
    echo "Found redpanda"
else
    echo "Not Found redpanda"
    kubectl kustomize "https://github.com/redpanda-data/redpanda-operator//src/go/k8s/config/crd?ref=v2.1.12-23.3.3" | kubectl apply -f -
fi
