kubectl get configmap --namespace default redpanda-rpk -o go-template='{{ .data.profile }}'
kubectl get secret redpanda-external-root-certificate -o go-template='{{ index .data "ca.crt" | base64decode }}' > ca.crt 
