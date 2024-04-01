rpk profile create develop
rpk profile use develop
rpk profile set kafka_api.brokers=localhost:19092 admin_api.addresses=localhost:19644

rpk cluster info

rpk cluster config set superusers ['admin']
rpk acl user create admin -p admin --mechanism scram-sha-512
rpk cluster config set enable_sasl true

rpk profile set user=admin pass=admin sasl.mechanism=scram-sha-512

rpk acl user create message -p message --mechanism scram-sha-512
rpk acl create --allow-principal User:message --operation write,read --topic message_message

rpk acl user create notification -p notification --mechanism scram-sha-512
rpk acl create --allow-principal User:notification --operation describe,read --topic message_message
rpk acl create --allow-principal User:notification --operation describe,read,write --group notification-service

rpk topic create message_message -p 10 -r 1
