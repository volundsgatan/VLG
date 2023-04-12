<script lang="ts">
	import MusicPlaylist from './MusicPlaylist.svelte';

	import coffee from './artwork/coffee.jpeg';
	import margs from './artwork/margs.jpeg';
	import p4 from './artwork/p4.png';

	import godJul from './artwork/god_jul.jpeg';
	import nyJulmusik from './artwork/ny_julmusik.jpeg';
	import { onMount } from 'svelte';
	import { sonosRequest, type Favourite } from './sonos';

	type Playlist = {
		name: string;
		image?: string;
		abbr?: string;
	};

	let playlists: Array<Playlist> = [
		{
			name: 'Your Favorite Coffeehouse',
			image: coffee
		},
		{
			name: 'disco margaritas',
			image: margs
		},
		{
			name: 'P4 Stockholm',
			image: p4
		},
		{
			name: 'Gustav Westlings Station',
			abbr: 'GW'
		},
		// {
		// 	name: 'VLG',
		// 	abbr: 'VLG'
		// },
		// {
		// 	name: '~/playlist',
		// 	abbr: '~/p'
		// },
		{
			name: 'God Jul',
			image: godJul
		},
		{
			name: 'Ny julmusik',
			image: nyJulmusik
		}
	];

	onMount(() => {
		sonosRequest('favorites/detailed')
			// .then((res) => res.json() as Array<Favourite>)
			.then((res) => res as Array<Favourite>)
			.then((favs) => {
				console.log(favs);
				playlists = favs
					.filter((f) => f.title.startsWith('⭐️') || f.title.startsWith('✏️'))
					.map((f) => {
						return {
							name: f.title,
							// abbr: f.title
							image: f.albumArtUri || undefined,
							abbr: (f.title.startsWith('✏️') && f.title.substring(1).trim()) || undefined
							// abbr: f.title,
						};
					});
			});
	});
</script>

<div class="flex flex-wrap justify-center gap-4">
	{#each playlists as playlist}
		<MusicPlaylist
			on:sonosUpdated
			image={playlist.image}
			name={playlist.name}
			abbr={playlist.abbr}
		/>
	{/each}
</div>
