import type { Group } from './devices';

type Config = {
	hostname: string;
	accounts: Map<string, string>;
	sonos: {
		devices: string[];
	};
	rooms: Room[];
	groups: Group[];
};

export type Room = {
	name: string;

	// touch area configuration
	top: number;
	left: number;
	height: number;
	width: number;
};

const config: Config = {
	hostname: 'unicorn-alligator.ts.net',

	// Identified by tailscale-whoami
	accounts: new Map<string, string>([
		['zegl@github', 'Gustav'],
		['elinclemmedsson@github', 'Elin']
	]),

	sonos: {
		devices: ['TV', 'Five', 'Bedroom', 'Kitchen']
	},

	rooms: [
		{
			name: 'Bedroom',
			top: 90,
			left: 60,
			height: 210,
			width: 310
		},

		{
			name: 'Kitchen',
			top: 310,
			left: 60,
			height: 190,
			width: 310
		},

		{
			name: 'Entrance',
			top: 210,
			left: 380,
			height: 150,
			width: 220
		},

		{
			name: 'Living Room',
			top: 80,
			left: 630,
			height: 220,
			width: 320
		}
	],

	groups: [
		{
			name: 'Living Room',
			devices: [
				{ addr: '0x00158d0008399e95' }, // Window Sensor
				{ addr: '0x0017880108faec55' }, // Window Light
				{ addr: '0x001788010b91f5c1' }, // Signe Floor Light
				{ addr: '0x00178801082ec23c' }, // Table Light
				{ addr: '0x00158d000802afb1' }, // Temperature Sensor
				{ addr: '0x9035eafffe62888f' }, // Tense
				{ sonosName: 'TV' },
				{ sonosName: 'Five' }
			]
		},

		{
			name: 'Bedroom',
			devices: [
				{ addr: '0x00158d0007f82461' }, // Temperature Sensor
				{ addr: '0x0017880108a1a40c' }, // Window Light
				{ addr: '0x003c84fffeb1547a' } // Ceiling Light
			]
		},

		{
			name: 'Closet',
			devices: [
				{ addr: '0x001788010678a381' }, // Closet Light
				{ addr: '0x84ba20fffe2ed631' } // Closet Motion Sensor
			]
		},

		{
			name: 'Kitchen',
			devices: [
				{ addr: '0x94deb8fffe6c21ac' }, // Motion Sensor
				{ addr: '0x588e81fffe8fb405' }, // Spotlight
				{ addr: '0x0017880108378b7d' }, // Ceiling
				{ addr: '0x00158d0007f82457' }, // Fridge Temperature Sensor
				{ sonosName: 'Kitchen' }
			]
		},

		{
			name: 'Bathroom',
			devices: [
				{ addr: '0x00158d0007f01537' } // Temperature Sensor
			]
		},

		{
			name: 'Entrance',
			devices: [
				{ addr: '0x00158d000839a1f9' }, // Door Sensor
				{ addr: '0x003c84fffeb6e38b' }, // Door Lamp
				{ addr: '0x94deb8fffe59db15' }, // Motion Sensor
				{ addr: '0x588e81fffe768eef' }, // Dimmer
				{ addr: '0x003c84fffeb15921' } // Dimmer (ceiling lamp)
			]
		},

		{
			name: 'Hallway',
			devices: []
		},

		{
			name: 'Yard',
			devices: [
				{ addr: '0x00158d0007e66b8a' } // Temperature Sensor
			]
		}
	]
};

export default config;
