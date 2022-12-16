import { derived, writable } from "svelte/store";
import type { State as SonosState, Zone } from "$lib/music/sonos";
import { sonosRequest } from "$lib/music/sonos";

// export const sonos = writable<Record<string, SonosState>>({});
export const sonosIsUpdating = writable(false);
export const sonosZones = writable<Array<Zone>>([]);

export const sonos = derived(sonosZones, ($sonosZones) => {
  const res: Record<string, SonosState> = {};
  for (const zone of $sonosZones) {
    for (const member of zone.members) {
      res[member.roomName] = member.state;
    }
  }
  return res;
});

export const fetchSonos = async () => {
  return sonosRequest("zones")
    .then((zones: Array<Zone>) => {
      sonosZones.set(zones);
    })
    .catch((err) => {
      console.error(err);
    });
};
