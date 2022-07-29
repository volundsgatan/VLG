<script context="module" lang="ts">
    export const prerender = true;
</script>

<script lang="ts">
    import {onMount} from "svelte";
    import {type State} from "../lib/devices";
    import Room from "../lib/Room.svelte";
    import Music from "../lib/Music.svelte";

    let states: Record<string, State> = {};
    let ws: WebSocket;

    let sonos: Record<string, any> = {};

    const fetchSonos = async () => {
        return fetch("http://vlg-pi:5005/zones")
            .then(res => res.json())
            .then(zones => {
                for (const zone of zones) {
                    for (const member of zone.members) {
                        sonos[member.roomName] = zone.coordinator.state
                    }
                }
            })
            .catch(err => {
                console.error(err);
            });
    }

    type m2qevent = {
        topic: string;
        payload?: State | string;
    }

    onMount(() => {
        ws = new WebSocket("ws://vlg-pi:8080/api")
        ws.onmessage = (event) => {
            const data: m2qevent = JSON.parse(event.data)
            // console.log(data)

            if (!data.payload) {
                return
            }
            if (typeof data.payload === "string") {
                return
            }

            if (states[data.topic]) {
                states[data.topic] = Object.assign(states[data.topic], data.payload)
            } else {
                states[data.topic] = data.payload
            }

            states = states
        }

        fetchSonos()
        setInterval(() => {
            fetchSonos()
        }, 3000)
    })
</script>

<svelte:head>
    <title>VLG 🏠❤️</title>
    <meta name="description" content="VLG"/>
</svelte:head>

<section>
    <div class="p-2 flex flex-col space-y-16 h-full">
        <div class="grid grid-cols-8 grid-rows-6 w-full text-gray-700">

            <div class="row-start-4 row-end-6 col-start-5 col-end-8 border-black">
                &nbsp;
            </div>

            <div class="row-start-1 row-end-4 col-start-6 col-end-8 border-2 border-l-0 border-black transition-all duration-500 flex flex-col space-y-2">
                <Room name="Living Room" states={states} ws={ws} sonos={sonos}/>
            </div>

            <div class="row-start-2 row-end-4 col-start-4 col-end-6 border-2 border-black border-l-0 border-t-0 transition-all duration-500">
                <Room name="Hallway" states="{states}" ws={ws}/>
            </div>

            <div class="row-start-4 row-end-6 col-start-4 col-end-5 border-black border-b-2 border-r-2 transition-all duration-500">
                <Room name="Entrance" parent="Hallway" states="{states}" ws={ws}/>
            </div>

            <div class="bg-orange-100 row-start-1 row-end-2 col-start-4 col-end-6 border-2 border-black border-l-0 flex flex-col">
                <Room name="Bathroom" states="{states}" ws={ws}/>
            </div>

            <div class="row-start-1 row-end-3 col-start-2 col-end-4 border-2 border-black border-b-0 transition-all duration-500 ">
                <Room name="Bedroom" states="{states}" ws={ws}/>
            </div>

            <div class="row-start-3 row-end-6 col-start-2 col-end-4 border-2 border-black transition-all duration-500 flex flex-col">
                <Room name="Kitchen" states="{states}" ws={ws} sonos={sonos}/>
            </div>

            <div class="bg-green-700 text-gray-100 row-start-1 row-end-6 col-start-1 col-end-2 p-2">
                <Room name="Yard" states="{states}" ws={ws}/>
            </div>
        </div>

        <Music />
    </div>


    <!---  <pre>{JSON.stringify(sonosSpeakersNowPlaying, null, '  ')}</pre> -->
    <!--- <pre>{states.size}  {JSON.stringify(Array.from(states), null, '  ')}</pre> -->
</section>
