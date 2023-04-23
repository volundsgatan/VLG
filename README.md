# VLG ❤️🏠 Home Automation

> 10 000 IQ HOME

- 📱 iPad Optimized frontend (with swipe touch controls etc), built with Svelte Kit, running on a wall-mounted iPad
- 🕸 Zigbee network (Zigbee2MQTT, Deconz ConBee 2)
- 🍏 Apple HomeKit Support via HomeBridge and [homebridge-z2m](https://github.com/itavero/homebridge-z2m)
- 🎻 Sonos Speaker Integration (via [node-sonos-http-api](https://github.com/jishi/node-sonos-http-api))
- 🌩 Deployed to Cloudflare Pages
- 🔒 Tailscale based authentication
- 📈 Prometheus, [mqtt-exporter](https://github.com/kpetremann/mqtt-exporter), [yr_exporter](https://github.com/zegl/yr_exporter), [nordpool_exporter](https://github.com/zegl/nordpool_exporter), and Grafana for tracking and monitoring
- 🛞 Running on bare-metal Kubernetes
- 🦉 Open source (GPL-3.0), but not very customizeable or easy to use

## Other features

- 👾 Nonogram/Picross [Game](https://vlg.life/jbk) and [Solver](https://vlg.life/jbk/solver/mr-cool) ([Source](https://github.com/volundsgatan/VLG/tree/main/www/src/lib/jbk))

## Screenshot

<img width="1140" alt="screenshot" src="https://user-images.githubusercontent.com/47952/195140895-a49f6a92-a993-4b04-88fe-0f50e8c21b43.png">

## Live demo

[demo-video.webm](https://user-images.githubusercontent.com/47952/195142788-30271b88-b7b9-48e2-b8c6-acb23c787372.webm)

## Setup instructions

**Dependencies**

| Name                                                                | Tailscale Service Name | Links                                   |
|---------------------------------------------------------------------|------------------------|-----------------------------------------|
| [zigbee2mqtt](https://github.com/Koenkk/zigbee2mqtt)                | `zigbee2mqtt`          | [Kubernetes](./kubernetes/zigbee2mqtt/) |
| [sonos-node-http-api](https://github.com/jishi/node-sonos-http-api) | `sonos`                | [Kubernetes](./kubernetes/sonos/)       |
| [Prometheus](https://github.com/prometheus/prometheus)              | `prometheus`           | [Kubernetes](./kubernetes/prometheus/)  |

1. Clone this repository
2. Update [config.ts](./www/src/lib/config.ts) to your liking.
3. Use a tool like [Sweet Home 3D](https://www.sweethome3d.com/) to generate different [permutations](./www/static/) of your floorplan in different light conditions. Each 0/1 is on/off in that room. Use the rooms in the same order in the file names as in the room configuration.
3. Assuming a tailscale network, and the dependencies running correctly...
4. Run `cd www && pnpm install && pnpm dev`!
