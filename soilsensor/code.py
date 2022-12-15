import time
import board
import busio
import json
import socketpool
import wifi
from adafruit_seesaw.seesaw import Seesaw
import adafruit_minimqtt.adafruit_minimqtt as MQTT
import os
import ipaddress
import analogio
import microcontroller
import alarm

print()
print("~ Booting VLG Plant Sensor")
print("~ Libraries loaded")


# Connectivity configuration
WIFI_SSID = "VLG"
WIFI_PASSWORD = "VLGVLGVLG"
MQTT_BROKER = "192.168.86.60"
MQTT_PORT = 1883
MQTT_TOPIC = "zigbee2mqtt/Plant1"

# Sampling configuration
SLEEP_TIMER = 2.0  # Time between samples
SAMPLES = 3  # Number of samples to make

DEEP_SLEEP_SECONDS = 120  # Time between measurements
USE_DEEP_SLEEP = True # If deep sleep should be used (or time.sleep)

# Board connectivity
i2c = busio.I2C(scl=board.GP1, sda=board.GP0)
ss = Seesaw(i2c, addr=0x36)

# VSYS -- 100k -- A2 -- 100k -- GRND
bat_adc = analogio.AnalogIn(board.A2)

wifi.radio.connect(WIFI_SSID, WIFI_PASSWORD)

print("~ Connected to WiFi (ipv4=%s)" % wifi.radio.ipv4_address)
pool = socketpool.SocketPool(wifi.radio)

#############################
# MQTT Client Configuration #
#############################

mqtt_client = MQTT.MQTT(
    broker=MQTT_BROKER,
    port=MQTT_PORT,
    socket_pool=pool,
)


def connect(mqtt_client, userdata, flags, rc):
    print("Connected to MQTT Broker!")


def disconnect(mqtt_client, userdata, rc):
    print("Disconnected from MQTT Broker!")


def subscribe(mqtt_client, userdata, topic, granted_qos):
    print("Subscribed to {0} with QOS level {1}".format(topic, granted_qos))


def unsubscribe(mqtt_client, userdata, topic, pid):
    print("Unsubscribed from {0} with PID {1}".format(topic, pid))


def publish(mqtt_client, userdata, topic, pid):
    print("Published to {0} with PID {1}".format(topic, pid))


def message(client, topic, message):
    print("New message on topic {0}: {1}".format(topic, message))


mqtt_client.on_connect = connect
mqtt_client.on_disconnect = disconnect
mqtt_client.on_subscribe = subscribe
mqtt_client.on_unsubscribe = unsubscribe
mqtt_client.on_publish = publish
mqtt_client.on_message = message

#############################
# Functions                 #
#############################


def quick_flash(times):
    led = digitalio.DigitalInOut(board.LED)
    led.direction = digitalio.Direction.OUTPUT
    for x in range(0, times):
        led.value = True
        time.sleep(0.2)
        led.value = False
        time.sleep(0.2)


def publish(moisture, battery_voltage):
    mqtt_client.connect()
    mqtt_client.subscribe(MQTT_TOPIC)
    mqtt_client.publish(
        MQTT_TOPIC,
        json.dumps(
            {
                "moisture": moisture,
                "voltage": battery_voltage,
                "cpu_temperature": microcontroller.cpu.temperature,
            }
        ),
    )
    mqtt_client.unsubscribe(MQTT_TOPIC)
    mqtt_client.disconnect()


def avg_soil(sleep_timer, samples):
    print("Testing Soil. samples=%d sleep_timer=%s" % (samples, sleep_timer))
    count = 0
    total = 0
    while count < samples:
        m = ss.moisture_read()
        total = total + m
        time.sleep(sleep_timer)
        count += 1
    soil = total / samples
    return round(soil, 1)


#############################
# Main                      #
#############################

while True:
    try:
        moisture = avg_soil(SLEEP_TIMER, SAMPLES)
        print("Moisture:{}".format(moisture))
        
        # 53000 * 3.3 / 65536
        # TODO: Should be (bat_adc.value * 3.3) / 65536 * 2 ??
        voltage = bat_adc.value * 3.3 / 65536 * 2

        publish(moisture, voltage)
    except (ValueError, RuntimeError) as e:
        print("Failed to get data\n", e)

    if USE_DEEP_SLEEP:
        # Device will reboot after the alarm fires
        print("~ Entering deep sleep! (seconds=%d)" % DEEP_SLEEP_SECONDS)
        time_alarm = alarm.time.TimeAlarm(monotonic_time=time.monotonic() + DEEP_SLEEP_SECONDS)
        alarm.exit_and_deep_sleep_until_alarms(time_alarm)
    else:
        time.sleep(DEEP_SLEEP_SECONDS)