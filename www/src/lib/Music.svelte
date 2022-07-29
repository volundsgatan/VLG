<script lang="ts">
    const play = async (name: string) => {
        return fetch("http://vlg-pi:5005/TV/favourite/" + name)
            .then(res => res.json())

            .then(async data => {
                await fetch("http://vlg-pi:5005/TV/shuffle/on")
                await fetch("http://vlg-pi:5005/TV/next")
            })

            .then(async data => {
                // Join ALL
                await fetch("http://vlg-pi:5005/Five/join/TV")
                await fetch("http://vlg-pi:5005/Kitchen/join/TV")
            })

            .catch(err => {
                console.error(err);
            });
    }

    const playlists = [
        {
            name: "Gustav Westling’s Station",
            abbr: "GW",
        },
        {
            name: "Your Favorite Coffeehouse",
            image: "https://i.scdn.co/image/ab67706f000000035ae7aa0454c9eafdd6505fda",
        },
        {
            name: "disco margaritas",
            image: "https://i.scdn.co/image/ab67706c0000bebb6dcceb12518c5cb7cccf0f3d",
        }
    ]
</script>

<div class="flex space-x-4 justify-center">
    {#each playlists as playlist}
        {#if playlist.image}
            <img src="{playlist.image}" class="h-28 w-28 cursor-pointer"
                 on:click|preventDefault={() => play(playlist.name)}/>
        {:else}
            <div class="cursor-pointer bg-red-200 h-28 w-28 text-red-600 text-2xl justify-center inline-flex items-center"
                 on:click|preventDefault={() => play(playlist.name)}>
                {playlist.abbr}
            </div>
        {/if}
    {/each}
</div>