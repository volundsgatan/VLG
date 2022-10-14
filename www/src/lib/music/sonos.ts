export const hostname = 'vlg-pi.unicorn-alligator.ts.net';

export const sonosRequest = (path: string): Promise<any> => {
	return fetch(`https://${hostname}/sonos/${path}`).then((res) => res.json());
};

export type Zone = {
	uuid: string;
	coordinator: Coordinator;
	members: Member[];
};

export type Coordinator = {
	uuid: string;
	state: State;
	roomName: string;
	coordinator: string;
	groupState: GroupState;
};

export type State = {
	volume: number;
	mute: boolean;
	equalizer: Equalizer;
	currentTrack: Track;
	nextTrack: Track;
	trackNo: number;
	elapsedTime: number;
	elapsedTimeFormatted: string;
	playbackState: 'PAUSED_PLAYBACK' | 'STOPPED' | 'PLAYING';
	playMode: PlayMode;
};

export type Equalizer = {
	bass: number;
	treble: number;
	loudness: boolean;
	speechEnhancement?: boolean;
	nightMode?: boolean;
};

export type Track = {
	artist: string;
	title?: string;
	album?: string;
	albumArtUri: string;
	duration: number;
	uri: string;
	trackUri: string;
	type: string;
	stationName: string;
	absoluteAlbumArtUri: string;
};

export type PlayMode = {
	repeat: string;
	shuffle: boolean;
	crossfade: boolean;
};

export type GroupState = {
	volume: number;
	mute: boolean;
};

export type Member = {
	uuid: string;
	state: State;
	roomName: string;
	coordinator: string;
	groupState: GroupState;
};
