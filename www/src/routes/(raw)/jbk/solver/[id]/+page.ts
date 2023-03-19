import type { PageLoad } from './$types';

export const prerender = false;

import guides from '$lib/jbk/guides.json';
import { redirect } from '@sveltejs/kit';

/*export const load: PageLoad = () => {
	let id = '';
	// const id = "candle";
	// const id = "sötisblötis";
	// const id = "JW";

	id = 'med-langa-ben';
	id = 'nalle';
	id = 'candle';
	id = 'slippery-conditions';
	id = 'ubuntu';
	id = 'skogens-konung';
	id = 'mr-cool';
	id = 'och-smasha';
	const guide = guides.find((g) => g.id === id);

	if (!guide) {
		throw redirect(302, '/jbk');
	}

	return {
		guide: guide
	};

	
};*/

export const load: PageLoad = ({ params }) => {
	const guide = guides.find((g) => g.id === params.id);

	if (!guide) {
		throw redirect(302, '/jbk');
	}

	return {
		guide: guide
	};
};
