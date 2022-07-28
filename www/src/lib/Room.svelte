<script lang="ts">
    import {type Device, type DeviceConfig, groups, type State} from "./devices";
    import Temperature from "./Temperature.svelte";
    import NowPlaying from "./NowPlaying.svelte";

    export let states: Record<string, State> = {};
    export let sonos: Record<string, any> = {};
    export let name: string;
    export let parent: string | null = null; // Light and background acting as another room
    export let ws: WebSocket;

    const mqttStatesForAddrs = (states: Record<string, State>, roomDevices: DeviceConfig[]) : State[] => {
        const configByAddr : Map<string, DeviceConfig> = new Map();
        for (const device of roomDevices) {
            configByAddr.set(device.addr, device);
        }
        return Object.values(states)
            .filter(s => configByAddr.has(s.device?.ieeeAddr))
            .map(s => ({
                ...s,
                webConfig: configByAddr.get(s.device?.ieeeAddr),
            }))
    }

    $: allDevices = groups.map(g => g.devices).flat();

    $: group = groups?.find(g => g.name == name)
    $: roomDevices = group.devices || [];
    $: roomMqttStates = mqttStatesForAddrs(states, roomDevices);

    // Get lights from this room, or from the parent room if any
    $: lightsGroupName = parent ? parent : name;
    $: roomLightsMqttStates = mqttStatesForAddrs(states, groups?.find(g => g.name == lightsGroupName).devices);
    $: lights = roomLightsMqttStates.filter(s => s.state !== undefined);
    $: anyLightOn = lights.some(s => s.state == "ON");
    $: haveLights = lights.length > 0;

    $: roomSonoses = roomDevices.map((d: DeviceConfig) => d.sonosName).filter(Boolean) || [];
    $: roomSonosStates = roomSonoses
        .map((name) => {
            return {
                name: name,
                state: sonos[name],
                webConfig: roomDevices.find(d => d.sonosName == name),
            }
        })


    const toggleLights = () => {
        for (const light of lights) {
            console.log(light)
            ws.send(JSON.stringify({
                topic: `${light.device.ieeeAddr}/set`,
                payload: {
                    state: anyLightOn ? "OFF" : "ON"
                }
            }))
        }
    }
</script>

<div class="{'grid grid-cols-'+group.size.cols+' grid-rows-'+group.size.rows+' flex-col p-2 md:p-4 h-full w-full'}"
     on:click={toggleLights}
     class:bg-orange-200="{haveLights && anyLightOn}"
     class:bg-gray-600="{haveLights && !anyLightOn}"
     class:text-gray-100="{haveLights && !anyLightOn}">

    {#each roomMqttStates as state}
        <div class="{
        'text-center inline-flex justify-center items-center text-xl md:text-2xl' +
        (state.webConfig.row ? ' row-start-' + state.webConfig.row  : '') +
        (state.webConfig.col ? ' col-start-' + state.webConfig.col : '')
        }">
            {#if state?.temperature}
                <Temperature temperature={state.temperature} light={anyLightOn}/>
            {:else if state.contact !== undefined}
                {#if state.contact}🚪{:else}☀️{/if}
            {:else if state.occupancy !== undefined}
                {#if state.occupancy}🏃{:else}💤{/if}
            {:else if state.state !== undefined}
                {#if state.state == "ON"}💡{:else}🌙{/if}
            {/if}
        </div>
    {/each}

    {#each roomSonosStates as state}
        <div class="{
        'text-center inline-flex justify-center items-center ' +
        (state.webConfig.row ? 'row-start-' + state.webConfig.row  : '') +
        (state.webConfig.col ? ' col-start-' + state.webConfig.col : '')
        }">
            <NowPlaying track={state}/>
        </div>
    {/each}
</div>