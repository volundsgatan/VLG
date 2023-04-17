export type Group = {
	name: string;
	devices: DeviceConfig[];
};

export type DeviceConfig = {
	addr?: string; // MQTT address
	sonosName?: string;
	col?: number;
	row?: number;
	dimmable?: boolean;
};

export type RoomSize = {
	cols: number;
	rows: number;
};

export type State = {
	device?: Device;
	last_seen?: number;
	state?: 'ON' | 'OFF';

	// temperature sensors
	pressure?: number; // hPa
	battery?: number; // %
	humidity?: number; // %
	temperature?: number; // C

	// energy
	voltage?: number; // V
	current?: number; // A
	energy?: number; // kWh
	power?: number; // W

	// open/closed sensors
	contact?: boolean;

	// motion sensors
	occupancy?: boolean;

	// lamps
	brightness?: number; // 0-254
};

export type Device = {
	ieeeAddr: string;
	friendlyName: string;
};
