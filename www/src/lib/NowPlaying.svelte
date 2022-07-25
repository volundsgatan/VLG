<script lang="ts">
    export let track;
</script>

<div class="inline-flex items-center space-x-2 w-full">
    <img src={track.absoluteAlbumArtUri} class="h-8 w-8" />
    <span class="text-sm overflow-hidden">{track.title}</span>
</div>