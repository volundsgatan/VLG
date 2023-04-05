#!/bin/bash

docker build -f Containerfile -t registry.unicorn-alligator.ts.net/whoami:latest .
docker push registry.unicorn-alligator.ts.net/whoami:latest