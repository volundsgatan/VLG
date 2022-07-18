<script context="module" lang="ts">
    export const prerender = true;
</script>

<script lang="ts">
    import {onMount} from "svelte";
    import {PrometheusDriver} from 'prometheus-query';

    // onMount(async () => {
    //     const prom = new PrometheusDriver({
    //         endpoint: "http://vlg:9090",
    //         baseURL: "/api/v1", // default value
    //         auth: {
    //             username: "admin",
    //             password: "ZpmTYyMETHPcDmzbyCqQrxKhgKPxgQ"
    //         },
    //     });
//
    //     const hue = await prom.instantQuery(`hue_light_brightness * hue_light_on`)
    //     console.log(hue.result)
    // });
</script>

<svelte:head>
    <title>VLG 🏠❤️</title>
    <meta name="description" content="VLG"/>
</svelte:head>

<section>
    <div class="p-8">
        <ul class="text-2xl">
            <li><a rel="external" href="https://zegl.grafana.net/d/CB4gXSgRz/vlg?orgId=1&refresh=10s">Grafana</a></li>
            <li><a rel="external" href="http://vlg.gurrewe94.gmail.com.beta.tailscale.net:9090/graph">Prometheus</a></li>
            <li>
                <a  rel="external" href="http://vlgvm.gurrewe94.gmail.com.beta.tailscale.net:8080/pwa/devices-sensors.html?_v=42f07f6c21c01a17be6c5c9163804cfd6437609d,6,1,17&gwid=00212EFFFF08287B">Phoscon
                    / Zigbee</a></li>
            <li><a rel="external" href="
    http://gustav-mbp-m1-13.gurrewe94.gmail.com.beta.tailscale.net:8581/">Homebridge</a></li>
        </ul>

        <div class="flex text-gray-500">
            <div class="border-gray-400 border-2 flex-1 h-32 grid grid-cols-3 grid-rows-3 bg-orange-100">
                <span class="">💡</span>
                <span class="row-start-2 col-start-1">💡</span>
                <span class="row-start-2 col-start-2 text-center">💡</span>
            </div>
            <div class="flex flex-col flex-1 h-32">
                <div class="border-gray-400 border-2 flex-1 grid grid-cols-3 grid-rows-3">
                    <span class=" row-start-1 col-start-2 text-center">💡</span>
                </div>
                <div class="border-gray-400 border-2 flex-1 ">
                    🚿
                </div>
            </div>
            <div class="flex flex-col flex-1 h-32">
                <div class="border-gray-400 border-2 flex-1 grid grid-cols-3 grid-rows-2">
                    <span class=" row-start-1 col-start-1 text-center">🌡️</span>
                    <span class=" row-start-1 col-start-2 text-center">💡</span>
                    <span class=" row-start-2 col-start-2 text-center">💡</span>
                </div>
                <div class="border-gray-400 border-2 bg-teal-800 flex-1 grid grid-cols-3 grid-rows-3">
                    <span class=" row-start-2 col-start-2 text-center">🌡️</span>
                    <span class=" row-start-2 col-start-3 text-center">💡</span>
                </div>
            </div>
            <div class="border-l-gray-400 border-l-2 flex flex-col w-12 h-32 bg-green-300 grid grid-cols-1 grid-rows-3">
                <span class=" row-start-3 col-start-1 text-center">🌡️</span>
            </div>
        </div>
    </div>
</section>

<style>

</style>
