#!/bin/bash

cd /home/vlg/VLG/pi

# Generate a new cert
sudo tailscale cert vlg-pi.unicorn-alligator.ts.net

# Restart Caddy
sudo docker restart pi-caddy-1

# Mosquitto hax
sudo cp vlg-pi.unicorn-alligator.ts.net.crt ./mosquitto-tls/
sudo cp vlg-pi.unicorn-alligator.ts.net.key ./mosquitto-tls/
sudo chmod 0777 /mosquitto-tls/
sudo chmod 0666 /mosquitto-tls/*

# Restart Mosquitto
sudo docker restart pi-mqtt-1