<script lang="ts">
	import MusicPlaylist from './MusicPlaylist.svelte';

	const playlists = [
		{
			name: 'Gustav Westling’s Station',
			abbr: 'GW'
		},
		{
			name: 'Your Favorite Coffeehouse',
			image: 'https://i.scdn.co/image/ab67706f000000035ae7aa0454c9eafdd6505fda'
		},
		{
			name: 'disco margaritas',
			image: 'https://i.scdn.co/image/ab67706c0000bebb6dcceb12518c5cb7cccf0f3d'
		},
		{
			name: 'P4 Stockholm',
			abbr: 'P4'
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
