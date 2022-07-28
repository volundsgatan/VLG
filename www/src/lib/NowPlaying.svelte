<script lang="ts">
    import {type Track} from "./sonos";

    type State = {
        currentTrack: Track;
        nextTrack: Track;
        elapsedTimeFormatted: string;
        volume: number;
        playbackState: "STOPPED" | "PLAYING";
    };

    type SonosInput = {
        state?: State;
    }

    export let track: SonosInput;
    export let icon: String = "🔉"

    const getTitle = (track: SonosInput): string | undefined => {
        console.log("track", track)

        if (track?.state?.currentTrack?.title) {
            return track.state.currentTrack.title;
        }

        if (track?.state?.currentTrack?.stationName) {
            return track.state.currentTrack.stationName;
        }

        if (track?.state?.currentTrack?.type === "line_in") {
            return "Line In";
        }

        return undefined;
    }

    const getArt = (track: TrackState): string | undefined => {
        if (track?.state?.currentTrack?.absoluteAlbumArtUri) {
            return track.state.currentTrack.absoluteAlbumArtUri;
        }
        return undefined;
    }

    $: title = getTitle(track);
    $: albumArt = getArt(track);
    $: isPlaying = track?.state?.playbackState === "PLAYING";
</script>

<div class="inline-flex items-center space-x-2">
    {#if !isPlaying}
        <span>🔇</span>
    {:else if albumArt}
        <img src={albumArt} class="h-full w-full"/>
    {:else if title}
        <span class="text-sm overflow-hidden">{title}</span>
    {:else}
        <span>{icon}</span>
    {/if}
</div>