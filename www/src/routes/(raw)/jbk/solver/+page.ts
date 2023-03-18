import type { PageLoad } from './$types';

export const prerender = false;

import guides from '$lib/jbk/guides.json';
import { redirect } from '@sveltejs/kit';

export const load: PageLoad = () => {
	let id = '';
	id = 'slippery-conditions';
	id = 'med-langa-ben';
	id = 'nalle';
	// const id = "candle";
	// const id = "sötisblötis";
	// const id = "JW";
	id = 'mr-cool';
	id = 'ubuntu';
	id = 'och-smasha';
	const guide = guides.find((g) => g.id === id);

	if (!guide) {
		throw redirect(302, '/jbk');
	}

	return {
		guide: guide
	};
};
