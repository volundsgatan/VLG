import type { State as DeviceState } from "$lib/devices";
import { derived, writable } from "svelte/store";

export type m2qevent = {
  topic: string;
  payload?: DeviceState | string;
};

export type State = Record<string, DeviceState>;

export const devices = writable<State>({});

export const sortedDevicesList = derived(
  devices,
  ($devices) => {
    const keys = Object.keys($devices).sort();
    return keys.map((key) => $devices[key]);
  },
);

export const z2mConnected = writable(false);

export const rawSocket = writable<WebSocket>();

export const connect = () => {
  z2mConnected.set(false);
  //  connected = false;
  //  states = {};

  devices.set({});

  const ws = new WebSocket("wss://vlg-pi.unicorn-alligator.ts.net/z2m/api");

  rawSocket.set(ws);

  ws.onmessage = (event) => {
    z2mConnected.set(true);
    // connected = true;
    // showNotConnected = false;

    const data: m2qevent = JSON.parse(event.data);
    if (!data.payload) {
      return;
    }
    if (typeof data.payload === "string") {
      return;
    }

    devices.update((s) => {
      if (s[data.topic]) {
        s[data.topic] = Object.assign(s[data.topic], data.payload);
      } else if (data.payload) {
        s[data.topic] = data.payload;
      }
      return s;
    });

    // if (states[data.topic]) {
    //   states[data.topic] = Object.assign(states[data.topic], data.payload);
    // } else {
    //   states[data.topic] = data.payload;
    // }
    //
    // states = states;

    // no traffic in 120s, disconnect
    // clearTimeout(trafficTimeout);
    // trafficTimeout = setTimeout(function () {
    //   ws.close();
    // }, 1000 * 120);
  };

  /*ws.onclose = function (e) {
    connected = false;
    showNotConnected = true;
    states = {};

    console.log(
      "Socket is closed. Reconnect will be attempted in 1 second.",
      e.reason,
    );
    clearTimeout(connectTimeout);
    connectTimeout = setTimeout(function () {
      connectZ2M();
    }, 1000);
  };*/

  ws.onerror = function (err) {
    console.error("Socket encountered error: ", err, "Closing socket");
    ws.close();
  };
};
