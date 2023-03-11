import type { PageLoad } from "./$types";

export const prerender = false;

import guides from "$lib/jbk/guides.json";

export const load: PageLoad = () => {
  return {
    games: guides.map((g) => {
      return {
        id: g.id,
        name: g.name,
      };
    }),
  };
};
