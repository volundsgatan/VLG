export const hostname = 'vlg-pi.unicorn-alligator.ts.net';

export const sonosRequest = (path: string): Promise<any> => {
	return fetch(`https://${hostname}/sonos/${path}`).then((res) => res.json());
};
