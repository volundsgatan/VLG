# MQTT

```bash
# Create new username/password
docker run -it --entrypoint mosquitto_passwd --volume (pwd)/mosquitto-config:/vlg  eclipse-mosquitto:2.0 -c /vlg/mosquitto-auth.txt $USERNAME
```
