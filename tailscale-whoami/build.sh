#!/bin/bash

docker build -f Containerfile -t registry.caddy-system.svc.cluster.local/whoami:latest .
docker push registry.caddy-system.svc.cluster.local/whoami:latest

#docker build -f Containerfile -t registry.unicorn-alligator.ts.net/whoami:latest .
#docker push registry.unicorn-alligator.ts.net/whoami:latest