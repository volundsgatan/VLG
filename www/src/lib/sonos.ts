export let sonosRequest = (path: string): Promise<any> => {
	return fetch(`https://vlg-pi.unicorn-alligator.ts.net/sonos/${path}`).then((res) => res.json());
};
