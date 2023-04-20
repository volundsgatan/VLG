import type { Room } from '$lib/config';

export type room = {
	room: Room;
	devices: string[];
	anyOn: boolean;
	brightness: number[];
};
