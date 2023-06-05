import {
  BridgeDevicesMessage,
  BridgeDevicesPayload,
  DeviceEventPayload,
  LightPayload,
  OccupancyPayload,
} from "./api.ts";
import { sleep } from "https://deno.land/x/sleep/mod.ts";

type ChangeHandler = (payload: DeviceEventPayload) => void;

class Device {
  id: string;

  constructor(id: string) {
    this.id = id;
  }

  private changeHandlers: ChangeHandler[] = [];

  public onchange(fn: ChangeHandler) {
    this.changeHandlers.push(fn);
  }

  public changed(payload: DeviceEventPayload) {
    for (const fn of this.changeHandlers) {
      fn(payload);
    }
  }
}

class MotionSensorDevice extends Device {
  last_occupancy_at?: Date;
}

class LightDevice extends Device {
  state = false;
  brightness = 0;
  last_on_at?: Date;
  last_off_at?: Date;

  public save(ws: WebSocket) {
    ws.send(JSON.stringify({
      "topic": `${this.id}/set`,
      "payload": {
        "state": this.state ? "ON" : "OFF",
        "brightness": this.brightness,
      },
    }));
  }
}

const delta = (minutes: number): Date => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + minutes);
  return now;
};

const run = async (devices: Device[], cb: (ws: WebSocket) => void) => {
  const endpoint = "wss://zigbee2mqtt.unicorn-alligator.ts.net/api";

  //try {
  const ws = new WebSocket(endpoint);
  ws.onopen = () => {
    console.log("Connected to server ...");
  };
  ws.onclose = () => {
    console.log("disconnected from server");
  };
  ws.onerror = (e) => {
    console.error(e);
  };

  let bridgeDevices: BridgeDevicesPayload[] = [];

  ws.onmessage = (m) => {
    try {
      const parse = JSON.parse(m.data);
      if (parse.topic === "bridge/devices") {
        bridgeDevices = (parse as BridgeDevicesMessage).payload;
        console.log("Got updated devices database");
        return;
      }

      console.log("new message on topic:", parse.topic);
      console.log(parse);

      if (typeof parse.payload === "undefined") {
        return;
      }

      const msg = parse.payload as DeviceEventPayload;

      console.log(
        "name/addr",
        msg?.device?.friendlyName,
        msg?.device?.ieeeAddr,
      );

      const bridgeDev = bridgeDevices.find((d) =>
        d.friendly_name === parse.topic || d.ieee_address === parse.topic
      );

      if (!bridgeDev) {
        console.error("no matching bridge device found");
        return;
      }

      console.log("found bridge device", { bridgeDev });

      const dev = devices.find((d) => d.id === bridgeDev.ieee_address);

      if (!dev) {
        console.error("no matching script device found");
        return;
      }

      console.log("found script device", { dev });
      dev.changed(msg);
    } catch (e) {
      console.error("oopsie!", e);
    }
  };

  while (true) {
    cb(ws);
    await sleep(5);
  }
};

const BathroomMotionSensor = new MotionSensorDevice("0x0c4314fffe5bf61b");

const BathroomDimmer = new LightDevice("0x8cf681fffeda50b7");

BathroomMotionSensor.onchange((payload: DeviceEventPayload) => {
  console.log("handling BathroomMotionSensor", { payload });
  const motion = payload as OccupancyPayload;
  if (motion.occupancy) {
    BathroomMotionSensor.last_occupancy_at = new Date();
  }
});

BathroomDimmer.onchange((payload: DeviceEventPayload) => {
  console.log("handling LightDevice", { payload });
  const light = payload as LightPayload;
  if (light.state === "ON" && BathroomDimmer.state === false) {
    BathroomDimmer.last_on_at = new Date();
  }
  if (light.state === "OFF" && BathroomDimmer.state === true) {
    BathroomDimmer.last_off_at = new Date();
  }
  BathroomDimmer.brightness = light.brightness;
  BathroomDimmer.state = light.state === "ON";
});

await run([
  BathroomMotionSensor,
  BathroomDimmer,
], (ws: WebSocket) => {
  console.log("callback");
  console.log("BathroomDimmer", BathroomDimmer);

  if (
    BathroomMotionSensor.last_occupancy_at &&
    BathroomMotionSensor.last_occupancy_at < delta(-30) && BathroomDimmer.state
  ) {
    BathroomDimmer.state = false;
    BathroomDimmer.save(ws);
  }
});
