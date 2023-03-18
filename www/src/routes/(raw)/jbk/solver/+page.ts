import type { PageLoad } from './$types';

export const prerender = false;

import guides from '$lib/jbk/guides.json';
import { redirect } from '@sveltejs/kit';

export const load: PageLoad = () => {
	let id = '';
	// const id = "candle";
	// const id = "sötisblötis";
	// const id = "JW";
	id = 'ubuntu';
	id = 'mr-cool';
	id = 'nalle';
	id = 'med-langa-ben';
	id = 'slippery-conditions';
	id = 'och-smasha';
	const guide = guides.find((g) => g.id === id);

	if (!guide) {
		throw redirect(302, '/jbk');
	}

	return {
		guide: guide
	};
};
