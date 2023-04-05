#!/bin/bash

docker build -f Containerfile -t registry.registry.svc.cluster.local:80/whoami:latest .
DOCKER_OPTS="--insecure-registry=registry.registry.svc.cluster.local" docker push http://registry.registry.svc.cluster.local:80/whoami:latest

#docker build -f Containerfile -t registry.unicorn-alligator.ts.net/whoami:latest .
#docker push registry.unicorn-alligator.ts.net/whoami:latest