import type { PageLoad } from "./$types";

export const prerender = false;

import guides from "$lib/jbk/guides.json";
import { redirect } from "@sveltejs/kit";

export const load: PageLoad = () => {
  // const id = "och-smasha";
  const id = "nalle";
  // const id = "med-langa-ben";
  const guide = guides.find((g) => g.id === id);

  if (!guide) {
    throw redirect(302, "/jbk");
  }

  return {
    guide: guide,
  };
};
