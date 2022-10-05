<script lang="ts">
	import MusicPlaylist from './MusicPlaylist.svelte';

	import coffee from './artwork/coffee.jpeg';
	import margs from './artwork/margs.jpeg';
	import p4 from './artwork/p4.png';

	const playlists = [
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
			name: 'Gustav Westling’s Station',
			abbr: 'GW'
		},
		{
			name: 'VLG',
			abbr: 'VLG'
		},
		{
			name: '~/playlist',
			abbr: '~/p'
		}
	];
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
