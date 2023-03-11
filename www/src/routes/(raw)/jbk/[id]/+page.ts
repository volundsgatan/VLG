import type { PageLoad } from "./$types";

export const prerender = false;

import guides from "$lib/jbk/guides.json";
import { redirect } from "@sveltejs/kit";

export const load: PageLoad = ({ params }) => {
  const guide = guides.find((g) => g.id === params.id);

  if (!guide) {
    throw redirect(302, "/jbk");
  }

  return {
    guide: guide,
  };
};
