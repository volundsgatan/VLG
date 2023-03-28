#!/bin/bash

#podman buildx build --platform linux/arm64,linux/amd64 -t registry.unicorn-alligator.ts.net/whoami:latest .

buildah build -f Containerfile --jobs=4 --platform=linux/amd64,linux/arm64 --manifest registry.unicorn-alligator.ts.net/whoami:latest .