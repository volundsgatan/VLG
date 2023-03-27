#!/bin/bash

docker buildx build --platform linux/arm64,linux/amd64 -t registry.unicorn-alligator.ts.net/whoami:latest . --push