<script context="module" lang="ts">
    export const prerender = true;
</script>

<script lang="ts">
    import {onMount} from "svelte";
    import NowPlaying from "../lib/NowPlaying.svelte";
    import Temperature from "../lib/Temperature.svelte";
    import Links from "../lib/Links.svelte";

    $: states = {}
    let ws: WebSocket;

    $: sonosSpeakersNowPlaying = {}

    const fetchSonos = async () => {
        return fetch("http://vlg-pi:5005/zones")
            .then(res => res.json())
            .then(zones => {
                // zones.
                // $: states.zones = zones;
                for (const zone of zones) {
                    for (const member of zone.members) {
                        // console.log(member.roomName, zone.)
                        sonosSpeakersNowPlaying[member.roomName] = zone.coordinator.state
                    }
                }
            })
            .catch(err => {
                console.error(err);
            });
    }

    onMount(() => {
        ws = new WebSocket("ws://vlg-pi:8080/api")
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data)
            const existing = states[data.topic]
            if (existing) {
                const merged = Object.assign(existing, data.payload)
                states[data.topic] = merged
            } else {
                states[data.topic] = data.payload
            }
        }


        fetchSonos()
        setInterval(() => {
            fetchSonos()
        }, 3000)
    })

    $: livingRoomWindowPowerOn = states && states["Living Room Ceiling"] && states["Living Room Ceiling"].state === "ON"
    $: entranceDimmerPowerOn = states && states["Hallway Dimmer"] && states["Hallway Dimmer"].state === "ON"
    $: kitchenDimmerPowerOn = states && states["Kitchen Dimmer"] && states["Kitchen Dimmer"].state === "ON"
    $: bedroomWindowPowerOn = states && states["Bedroom Window"] && states["Bedroom Window"].state === "ON"

    $: livingRoomTemperature = states && states["Living Room"] && states["Living Room"].temperature
    $: bathRoomTemperature = states && states["Bathroom"] && states["Bathroom"].temperature
    $: bedroomTemperature = states && states["Bedroom"] && states["Bedroom"].temperature
    $: outdoorTemperature = states && states["Outdoor"] && states["Outdoor"].temperature
    $: fridgeTemperature = states && states["Fridge"] && states["Fridge"].temperature

    $: livingRoomWindowClosed = states?.["Living Room Window Sensor"]?.contact
    $: entranceDoorClosed = states?.["Entrance Door Sensor"]?.contact

    $: sonosLivingRoomIsPlaying = sonosSpeakersNowPlaying?.["Five"]?.playbackState === "PLAYING"
    $: sonosLivingRoomTrack = sonosSpeakersNowPlaying?.["Five"]?.currentTrack

    $: sonosTvIsPlaying = sonosSpeakersNowPlaying?.["TV"]?.playbackState === "PLAYING"
    $: sonosTvTrack = sonosSpeakersNowPlaying?.["TV"]?.currentTrack

    $: sonosKitchenIsPlaying = sonosSpeakersNowPlaying?.["Kitchen"]?.playbackState === "PLAYING"
    $: sonosKitchenTrack = sonosSpeakersNowPlaying?.["Kitchen"]?.currentTrack

    const toggle = (cond: Boolean, topics: String[]) => {
        if (!ws) {
            return
        }

        const c = cond;

        topics.forEach(topic => {
            ws.send(JSON.stringify({
                topic: `${topic}/set`,
                payload: {
                    state: c ? "OFF" : "ON"
                }
            }))
        })
    }
</script>

<svelte:head>
    <title>VLG 🏠❤️</title>
    <meta name="description" content="VLG"/>
</svelte:head>

<section>
    <div class="p-2 md:p-8">
        <div class="grid grid-cols-7 md:grid-cols-8 grid-rows-8 h-48 w-full text-gray-700">

            <div class="row-start-2 col-start-1 hidden md:block">&nbsp;</div>

            <div class="row-start-3 col-start-1 hidden md:block">
                <!-- Street Window -->
                <div class="text-2xl text-right">
                    {#if livingRoomWindowClosed}
                        🪟
                    {:else}
                        🔓
                    {/if}
                </div>
            </div>

            <div class="row-start-4 col-start-1 hidden md:block">&nbsp;</div>
            <div class="row-start-5 col-start-1 hidden md:block">&nbsp;</div>
            <div class="row-start-6 col-start-1 hidden md:block">&nbsp;</div>
            <div class="row-start-7 col-start-1 hidden md:block">&nbsp;</div>
            <div class="row-start-8 col-start-1 hidden md:block">&nbsp;</div>

            <div class="row-start-2 row-end-7 col-start-1 md:col-start-2 col-end-4 border-2 border-t-0 border-black transition-all duration-500 p-2 md:p-4 flex flex-col"
                 class:bg-orange-200="{livingRoomWindowPowerOn}"
                 class:bg-gray-800="{!livingRoomWindowPowerOn}"
                 class:text-gray-100="{!livingRoomWindowPowerOn}"
                 on:click={toggle(livingRoomWindowPowerOn, ["Living Room Ceiling", "Living Room Window", "Living Room Signe"])}
            >
                <Temperature temperature={livingRoomTemperature} light={livingRoomWindowPowerOn}/>

                {#if sonosLivingRoomIsPlaying}
                    <NowPlaying track={sonosLivingRoomTrack}/>
                {/if}

                {#if sonosTvIsPlaying}
                    <NowPlaying track={sonosTvTrack}/>
                {/if}
            </div>

            <div class="row-start-2 row-end-6 col-start-4 col-end-6 border-2 border-black border-l-0 border-t-0 transition-all duration-500"
                 class:bg-orange-200="{entranceDimmerPowerOn}"
                 class:bg-gray-800="{!entranceDimmerPowerOn}"
                 class:text-gray-100="{!entranceDimmerPowerOn}"
                 on:click={toggle(entranceDimmerPowerOn, ["Hallway Dimmer"])}
            ></div>

            <div class="row-start-1 row-end-2  col-start-1 md:col-start-2 col-end-5 border-black border-b-2 border-r-2">
                <!-- Top Border -->
                &nbsp;
            </div>

            <div class="row-start-1 row-end-2 col-start-5 col-end-6 border-black border-t-2 border-r-2 transition-all duration-500"
                 class:bg-orange-200="{entranceDimmerPowerOn}"
                 class:bg-gray-800="{!entranceDimmerPowerOn}"
                 on:click={toggle(entranceDimmerPowerOn, ["Hallway Dimmer"])}
            >
                <!-- Entrance By Door -->
                <div class="text-2xl text-center">
                    {#if entranceDoorClosed}
                        🚪
                    {:else}
                        🔓
                    {/if}
                </div>

            </div>

            <div class="bg-orange-100 row-start-6 row-end-7 col-start-4 col-end-6 border-2 border-black border-l-0 border-t-0 p-2 md:p-4 flex flex-col">
                <!-- Bathroom -->
                <Temperature temperature={bathRoomTemperature}/>
            </div>

            <div class="row-start-4 row-end-7 col-start-6 col-end-8 border-2 border-black border-t-0 border-l-0 transition-all duration-500 p-2 md:p-4"
                 class:bg-orange-200="{bedroomWindowPowerOn}"
                 class:bg-gray-800="{!bedroomWindowPowerOn}"
                 class:text-gray-100="{!bedroomWindowPowerOn}"
                 on:click={toggle(bedroomWindowPowerOn, ["Bedroom Window"])}
            >
                <!-- Bedroom -->
                <Temperature temperature={bedroomTemperature} light={bedroomWindowPowerOn}/>
            </div>

            <div class="row-start-1 row-end-4 col-start-6 col-end-8 border-2 border-black border-l-0 transition-all duration-500 p-2 md:p-4 flex flex-col"
                 class:bg-orange-200="{kitchenDimmerPowerOn}"
                 class:bg-gray-800="{!kitchenDimmerPowerOn}"
                 class:text-gray-100="{!kitchenDimmerPowerOn}"
                 on:click={toggle(kitchenDimmerPowerOn, ["Kitchen Dimmer", "Kitchen Ceiling"])}
            >
                <!-- Kitchen -->
                <Temperature temperature={fridgeTemperature} light={kitchenDimmerPowerOn}/>
                {#if sonosKitchenIsPlaying}
                    <NowPlaying track={sonosKitchenTrack}/>
                {/if}
            </div>

            <div class="bg-green-700 text-gray-100 row-start-1 row-end-7 col-start-8 col-end-9 p-2 md:p-4 hidden md:block">
                <!-- Yard -->
                <Temperature temperature={outdoorTemperature}/>
            </div>
        </div>


    </div>

    <Links/>

    <!--- <pre>{JSON.stringify(sonosSpeakersNowPlaying, null, '  ')}</pre> --->
    <!--- <pre>{JSON.stringify(states, null, '  ')}</pre> --->
</section>
