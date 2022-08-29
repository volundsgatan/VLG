<script lang="ts">
    import {type Zone} from '../sonosApi';
    import Button from './Button.svelte'
    import {createEventDispatcher, onDestroy, onMount} from 'svelte';

    const dispatch = createEventDispatcher();

    export let zone: Zone;
    $: rooms = zone.members.map((m) => m.roomName);

    const command = (cmd: string) => {
        return fetch(
            `http://vlg-pi.volundsgatan.org.github.beta.tailscale.net:5005/${zone.coordinator.roomName}/${cmd}`
        )
            .then((res) => res.json())
            .then(() => dispatch('sonosUpdated', {}));
    };

    const next = () => {
        return command('next');
    };
    const playpause = () => {
        return command('playpause');
    };
    const previous = () => {
        return command('previous');
    };
    const isolate = () => {
        return command('isolate');
    };
    const broadcast = () => {
        const sonoses = ['TV', 'Five', "Kitchen"]
        const otherSonoses = sonoses.filter((n) => n !== zone.coordinator.roomName)
        const joins = otherSonoses.map((n) => command(`add/${n}`))
        return Promise.all(joins);
    };

    $: hasTitleAndAlbum =
        zone.coordinator.state.currentTrack.title && zone.coordinator.state.currentTrack.album;

    const getArt = (z: Zone): string | undefined => {
        if (zone.coordinator.state.currentTrack.absoluteAlbumArtUri) {
            let uri = new URL(zone.coordinator.state.currentTrack.absoluteAlbumArtUri);

            if (uri.protocol === 'http:') {
                uri.host = 'vlg-pi.volundsgatan.org.github.beta.tailscale.net:8081';
                uri.pathname = `/sonos${uri.pathname}`;
            }

            return uri.toString();
        }
        return undefined;
    };

    $: albumArt = getArt(zone);

    let volume = 0;
    onMount(() => {
        volume = zone.coordinator.state.volume;
    });
    const volumeInterval = setInterval(() => {
        volume = zone.coordinator.state.volume;
    }, 5000);
    onDestroy(() => clearInterval(volumeInterval));

    const onSetVolume = () => {
        return command(`groupVolume/${volume}`);
    };

    $: isPartyMode = zone.members.length > 1
    $: isPlaying = zone.coordinator.state.playbackState === 'PLAYING'
</script>

<div class="flex items-center rounded-lg bg-stone-600 p-3">
    <div class="flex w-2/5 items-center space-x-4 overflow-hidden text-ellipsis">
        {#if albumArt}
            <img class="h-12 w-12 bg-red-200" src={albumArt}/>
        {/if}
        <div>
            <div class="text-white">{rooms.join(', ')}</div>
            {#if hasTitleAndAlbum}
                <div class="whitespace-nowrap text-stone-300">
                    {zone.coordinator.state.currentTrack.title}
                    &#183; {zone.coordinator.state.currentTrack.album}
                </div>
            {:else if zone.coordinator.state.currentTrack.stationName}
                <div class="text-stone-300">{zone.coordinator.state.currentTrack.stationName}</div>
            {/if}
        </div>
    </div>

    <div class="flex flex-1 justify-center text-white">
        <div class="flex items-center space-x-4 text-2xl ">
            <Button on:click={previous}>👈</Button>
            <Button on:click={playpause}>
                {isPlaying ? '⏸️' : '▶️'}
            </Button>
            <Button on:click={next}>👉</Button>
        </div>
    </div>

    <div class="flex w-2/5 items-center space-x-2">
        <div class="flex-1"/>

        {#if isPlaying}
            <Button on:click={broadcast}>🪩</Button>
        {:else}
            <div class="w-12">&nbsp;</div>
        {/if}

        {#if isPartyMode}
            <Button on:click={isolate}>🙉</Button>
        {:else}
            <div class="w-12">&nbsp;</div>
        {/if}

        <div class="w-8"></div>

        <span class="text-2xl">🔈</span>
        <input
                type="range"
                id="volume"
                name="volume"
                bind:value={volume}
                on:change={onSetVolume}
                min="0"
                max="100"
        />
    </div>
</div>
