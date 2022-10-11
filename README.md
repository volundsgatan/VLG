# VLG ❤️🏠 Home Automation

> 10 000 IQ HOME

* 📱 iPad Optimized frontend (with swipe touch controls etc), built with Svelte Kit, running on a wall-mounted iPad
* 🕸 Zigbee network (Zigbee2MQTT, Deconz ConBee 2), running on a Raspberry Pi 2 Model B (2015)
* 🍏 Apple HomeKit Support via HomeBridge and [homebridge-z2m](https://github.com/itavero/homebridge-z2m)
* 🎻 Sonos Speaker Integration (via [node-sonos-http-api](https://github.com/jishi/node-sonos-http-api))
* 🌩 Deployed to Cloudflare Pages
* 🔒 Tailscale based authentication
* 📈 Prometheus, [mqtt-exporter](https://github.com/kpetremann/mqtt-exporter), and Grafana for tracking and monitoring

## Screenshot

<img width="1140" alt="screenshot" src="https://user-images.githubusercontent.com/47952/195140895-a49f6a92-a993-4b04-88fe-0f50e8c21b43.png">

## Live demo

[demo-video.webm](https://user-images.githubusercontent.com/47952/195142788-30271b88-b7b9-48e2-b8c6-acb23c787372.webm)

## Zigbee Network


| Device                                                                                                             	| Count 	| Cost                 	|
|--------------------------------------------------------------------------------------------------------------------	|-------	|----------------------	|
| 🌡 [Aqara Weater](https://www.zigbee2mqtt.io/devices/WSDCGQ11LM.html#xiaomi-wsdcgq11lm)                               	| 5     	| 179 SEK              	|
| 🚪 [Aqara Contact](https://www.zigbee2mqtt.io/devices/MCCGQ11LM.html#xiaomi-mccgq11lm)                                	| 2     	| 159 SEK              	|
| 💡 [IKEA Tradfri 30W Driver](https://www.zigbee2mqtt.io/devices/ICPSHC24-30EU-IL-1.html#ikea-icpshc24-30eu-il-1)      	| 2     	| 300 SEK              	|
| 💡 [Philips Hue E27 Color](https://www.zigbee2mqtt.io/devices/9290022166.html#philips-9290022166)                     	| 3     	| 400 SEK              	|
| 💡 [Philips Hue Smart Plug](https://www.zigbee2mqtt.io/devices/929002240401.html#philips-929002240401)                	| 1     	| 289 SEK              	|
| 💡 [Philips Hue Signe Floor Light](https://www.zigbee2mqtt.io/devices/4080248U9.html#philips-4080248u9)               	| 1     	| 3 190 SEK            	|
| 💡 [Philips Hue E27 White Filament Bulb](https://www.zigbee2mqtt.io/devices/8718699688882.html#philips-8718699688882) 	| 1     	| 279 SEK              	|
| 🎛 [Philips Hue Dimmer Switch](https://www.zigbee2mqtt.io/devices/324131092621.html#philips-324131092621)             	| 2     	| 219 SEK              	|
| 🎛 [IKEA Tradfri On/Off](https://www.zigbee2mqtt.io/devices/E1743.html#ikea-e1743)                                    	| 2     	| 69 SEK               	|
| 🏃‍♂️ [IKEA Tradfri Motion Sensor](https://www.zigbee2mqtt.io/devices/E1525_E1745.html#ikea-e1525%252Fe1745)             	| 3     	| 99 SEK               	|
| 💡 [Gledoptro Triac AC Dimmer](https://www.zigbee2mqtt.io/devices/GL-SD-001.html#gledopto-gl-sd-001)                  	| 3     	| 349 SEK              	|
| 💡 [Sunricher SR-ZG9040A Dimmer](https://www.zigbee2mqtt.io/devices/SR-ZG9040A.html#sunricher-sr-zg9040a)             	| 1     	| 449 SEK              	|
| **SUM**                                                                                                            	| 26    	| 9 140 SEK (~811 USD) 	|


## Network 

![Untitled Diagram drawio](https://user-images.githubusercontent.com/47952/188018690-a81be359-d4e2-45a2-8a30-cd627ff2fa96.png)
