<script lang="ts">
    import {type State} from "./devices";

    export let state: State;
    export let ws: WebSocket;

    const levels = [0, 50, 125, 254]
    const emojis = ["🌙", "🏮", "🕯", "💡"]

    const emoji = (s: State) => {
        if (s.state === "ON") {
            if (s.brightness === undefined) {
                return "💡"
            }

            for (const [idx, level] of levels.entries()) {
                if (s.brightness <= level) {
                    return emojis[idx]
                }
            }
        }

        return "🌙"
    }

    const nextBrightness = (s: State): number => {
        if (s.brightness === undefined) {
            return s.state === "ON" ? 0 : 254
        }

        for (const [idx, level] of levels.entries()) {
            if (s.brightness <= level) {
                return levels[(idx + 1) % levels.length]
            }
        }
    }


    const toggle = () => {
        const b = nextBrightness(state)
        ws.send(JSON.stringify({
            topic: `${state.device.ieeeAddr}/set`,
            payload: {
                state: b === 0 ? "OFF" : "ON",
                brightness: b,
            }
        }))
    }

    $: icon = emoji(state)
</script>

{#if state}
    <div on:click|stopPropagation={toggle} class="cursor-pointer">
        {icon}
    </div>
{/if}
