import type { PageLoad } from "./$types";

export const prerender = false;

import guides from "$lib/jbk/guides.json";
import { redirect } from "@sveltejs/kit";

export const load: PageLoad = () => {
  //const id = "och-smasha";
  //const id = "nalle";
  // const id = "med-langa-ben";
  // const id = "slippery-conditions";
  // const id = "candle";
  const id = "mr-cool";
  // const id = "exported";
  const guide = guides.find((g) => g.id === id);

  if (!guide) {
    throw redirect(302, "/jbk");
  }

  return {
    guide: guide,
  };
};
