export type Group = {
    name: String;
    devices: DeviceConfig[];
    size: RoomSize;
}

export type DeviceConfig = {
    addr?: string; // MQTT address
    sonosName?: string;
    col?: number;
    row?: number;
}

export type RoomSize = {
    cols: number;
    rows: number;
}

export const groups: Group[] = [
    {
        name: 'Living Room',
        size: {
            cols: 5,
            rows: 5,
        },
        devices: [
            {addr: "0x00158d0008399e95", row: 3, col: 5}, // Window Sensor
            {addr: "0x0017880108faec55", row: 2, col: 5}, // Window Light
            {addr: "0x001788010b91f5c1", row: 1, col: 5}, // Signe Floor Light
            {addr: "0x00178801082ec23c", row: 3, col: 4}, // Table Light
            {addr: "0x00158d000802afb1", row: 3, col: 3}, // Temperature Sensor
            // {addr: "0x00178801082ec23c", row: 3, col: 4}, // Sofa light (fake addr)
            {addr: "0x0017880108096165"}, // Hue Switch
            {sonosName: "TV", row: 5, col: 2},
            {sonosName: "Five", row: 5, col: 5},
        ],
    },

    {
        name: 'Bedroom',
        size: {
            cols: 3,
            rows: 1,
        },
        devices: [
            {addr: "0x00158d0007f82461", row: 1, col: 2}, // Temperature Sensor
            {addr: "0x0017880108a1a40c", row: 1, col: 1},  // Window Light
        ],
    },

    {
        name: 'Kitchen',
        size: {
            cols: 3,
            rows: 5,
        },
        devices: [
            {addr: "0x94deb8fffe6c21ac", row: 4, col: 3}, // Motion Sensor
            {addr: "0x588e81fffe8fb405", row: 5, col: 2}, // Spotlight
            {addr: "0x0017880108378b7d", row: 3, col: 2}, // Ceiling
            {addr: "0x00158d0007f82457", row: 5, col: 3}, // Fridge Temperature Sensor
            {sonosName: "Kitchen", row: 1, col: 3},
        ]
    },

    {
        name: 'Bathroom',
        size: {
            cols: 1,
            rows: 1,
        },
        devices: [
            {addr: "0x00158d0007f01537", row: 1, col: 1}, // Temperature Sensor
        ]
    },

    {
        name: "Entrance",

        size: {
            cols: 1,
            rows: 2,
        },
        devices: [
            {addr: "0x00158d000839a1f9", row: 2, col: 1}, // Door Sensor
            {addr: "0x003c84fffeb6e38b", row: 1, col: 1}, // Door Lamp
        ]
    },

    {
        name: "Hallway",

        size: {
            cols: 3,
            rows: 3,
        },
        devices: [
            {addr: "0x94deb8fffe59db15", row: 3, col: 1}, // Motion Sensor
            {addr: "0x588e81fffe768eef", row: 3, col: 3}, // Dimmer
            {addr: "0x003c84fffeb15921", row: 2, col: 2}, // Dimmer (ceiling lamp)
        ]
    },

    {
        name: "Yard",
        size: {
            cols: 1,
            rows: 1,
        },
        devices: [
            {addr: "0x00158d0007e66b8a", row: 1, col: 1}, // Temperature Sensor
        ],
    }
]

export type State = {
    device?: Device;
    last_seen?: number;
    state?: "ON" | "OFF";

    // temperature sensors
    pressure?: number;
    battery?: number;
    humidity?: number;
    temperature?: number;
    voltage?: number;

    // open/closed sensors
    contact?: boolean;

    // motion sensors
    occupancy?: boolean

    // lamps
    brightness?: number;
}

export type Device = {
    ieeeAddr: string;
    friendlyName: string;
}

/*
  "Living Room Window": {
    "device": {
      "applicationVersion": 2,
      "dateCode": "20211119",
      "friendlyName": "Living Room Window",
      "hardwareVersion": 1,
      "ieeeAddr": "0x0017880108faec55",
      "manufacturerID": 4107,
      "manufacturerName": "Signify Netherlands B.V.",
      "model": "929002240401",
      "networkAddress": 47838,
      "powerSource": "Mains (single phase)",
      "softwareBuildID": "1.93.6",
      "stackVersion": 1,
      "type": "Router",
      "zclVersion": 2
    },
    "last_seen": 1658919528038,
    "linkquality": 191,
    "state": "OFF",
    "update": {
      "state": "idle"
    },
    "update_available": false
  },
 */