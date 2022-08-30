<script lang="ts">
    import {onMount} from 'svelte';
    import {type State} from '$lib/devices';
    import Home from '$lib/Home.svelte';
    import Spinner from '$lib/Spinner.svelte';
    import {type State as SonosState, type Zone} from '$lib/sonosApi';

    let connected = false;
    let showNotConnected = false;

    let states: Record<string, State> = {};
    let ws: WebSocket;

    let sonos: Record<string, SonosState> = {};
    let sonosIsUpdating = false;
    let sonosZones: Array<Zone> = [];

    const fetchSonos = async () => {
        return fetch('http://vlg-pi.volundsgatan.org.github.beta.tailscale.net:5005/zones')
            .then((res) => res.json())
            .then((zones: Array<Zone>) => {
                sonosZones = zones;
                for (const zone of zones) {
                    for (const member of zone.members) {
                        sonos[member.roomName] = member.state;
                    }
                }
            })
            .catch((err) => {
                console.error(err);
            });
    };

    type m2qevent = {
        topic: string;
        payload?: State | string;
    };

    const onSonosUpdated = async () => {
        console.log('onSonosUpdated');
        sonosIsUpdating = true;
        for (let i = 0; i < 10; i++) {
            await fetchSonos();
            await new Promise((f) => setTimeout(f, 100));
        }
        sonosIsUpdating = false;
    };

    let connectTimeout;
    let trafficTimeout;

    const connectZ2M = () => {
        connected = false
        states = {}

        ws = new WebSocket('ws://vlg-pi.volundsgatan.org.github.beta.tailscale.net:8080/api');

        ws.onmessage = (event) => {
            connected = true
            showNotConnected = false

            const data: m2qevent = JSON.parse(event.data);
            if (!data.payload) {
                return;
            }
            if (typeof data.payload === 'string') {
                return;
            }

            if (states[data.topic]) {
                states[data.topic] = Object.assign(states[data.topic], data.payload);
            } else {
                states[data.topic] = data.payload;
            }

            states = states;

            // no traffic in 120s, disconnect
            clearTimeout(trafficTimeout)
            trafficTimeout = setTimeout(function () {
                ws.close()
            }, 1000 * 120);
        };

        ws.onclose = function (e) {
            connected = false
            showNotConnected = true
            states = {}

            console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
            clearTimeout(connectTimeout)
            connectTimeout = setTimeout(function () {
                connectZ2M();
            }, 1000);
        };

        ws.onerror = function (err) {
            console.error('Socket encountered error: ', err, 'Closing socket');
            ws.close();
        };
    };

    onMount(() => {
        connectZ2M();

        fetchSonos();

        setInterval(() => {
            fetchSonos();
        }, 5000);
    });
</script>

<svelte:head>
    <title>VLG</title>
    <meta name="description" content="VLG"/>
</svelte:head>


{#if connected}
    <Home {states}
          {ws}
          {sonos}
          {sonosIsUpdating}
          {sonosZones}
    />
{:else}
    <div class="text-gray-300 flex items-center flex-col min-h-screen justify-center gap-16">
        <div class="text-8xl">❤️🏠</div>
        {#if showNotConnected}
            <div>Nä nu gick något fel hörru! Har du loggat in?</div>
            {:else}
            <Spinner />
        {/if}
    </div>
{/if}