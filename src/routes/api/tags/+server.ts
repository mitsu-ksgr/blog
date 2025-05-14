/*---------------------------------------------------------------------------
 * src/routes/api/tags/+server.ts
 *
 * Tags endpoints
 *---------------------------------------------------------------------------*/
import { json } from "@sveltejs/kit";
import { loadTags } from "$lib/catalog";

import type { RequestHandler } from "./$types";
import type { TagList } from "$lib/types/tag";

export const prerender = true;

/**
 * Return all entries
 */
export const GET: RequestHandler = async () => {
  const taglist: TagList = await loadTags();
  return json({ taglist });
};
