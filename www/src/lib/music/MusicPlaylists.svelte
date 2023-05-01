<script lang="ts">
	import MusicPlaylist from './MusicPlaylist.svelte';
	import { onMount } from 'svelte';
	import { sonosRequest, type Favourite } from './sonos';

	type Playlist = {
		name: string;
		image?: string;
		abbr?: string;
	};

	let playlists: Array<Playlist> = [];

	onMount(() => {
		sonosRequest('favorites/detailed')
			.then((res) => res as Array<Favourite>)
			.then((favs) => {
				playlists = favs
					.filter((f) => f.title.startsWith('⭐️') || f.title.startsWith('✏️'))
					.map((f) => {
						return {
							name: f.title,
							image: f.albumArtUri || undefined,
							abbr: (f.title.startsWith('✏️') && f.title.substring(1).trim()) || undefined
						};
					});
			});
	});
</script>

<div class="flex flex-wrap gap-4">
	{#each playlists as playlist}
		<MusicPlaylist
			on:sonosUpdated
			image={playlist.image}
			name={playlist.name}
			abbr={playlist.abbr}
		/>
	{/each}
</div>
