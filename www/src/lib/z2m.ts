import type { State as DeviceState } from '$lib/devices';
import { derived, writable } from 'svelte/store';

export type m2qevent = {
	topic: string;
	payload?: DeviceState | string;
};

export type State = Record<string, DeviceState>;

export const devices = writable<State>({});

export const sortedDevicesList = derived(devices, ($devices) => {
	const keys = Object.keys($devices).sort();
	return keys.map((key) => $devices[key]);
});

export const z2mConnected = writable(false);
export const z2mConnectionError = writable(false);

export const rawSocket = writable<WebSocket>();

let connectTimeout: NodeJS.Timeout;
let trafficTimeout: NodeJS.Timeout;

export const connect = () => {
	z2mConnected.set(false);
	devices.set({});

	const ws = new WebSocket('wss://vlg-pi.unicorn-alligator.ts.net/z2m/api');

	rawSocket.set(ws);

	ws.onmessage = (event) => {
		z2mConnected.set(true);
		z2mConnectionError.set(false);

		const data: m2qevent = JSON.parse(event.data);
		if (!data.payload) {
			return;
		}
		if (typeof data.payload === 'string') {
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

		// no traffic in 120s, disconnect
		clearTimeout(trafficTimeout);
		trafficTimeout = setTimeout(function () {
			ws.close();
		}, 1000 * 120);
	};

	ws.onclose = function (e) {
		z2mConnected.set(false);
		z2mConnectionError.set(true);
		devices.set({});

		console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
		clearTimeout(connectTimeout);
		connectTimeout = setTimeout(function () {
			connect();
		}, 1000);
	};

	ws.onerror = function (err) {
		console.error('Socket encountered error: ', err, 'Closing socket');
		ws.close();
	};
};
