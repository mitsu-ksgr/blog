/*---------------------------------------------------------------------------
 * src/routes/api/entries/+server.ts
 *
 * Entries endpoints
 *---------------------------------------------------------------------------*/
import { json } from "@sveltejs/kit";
import { loadArticles } from "$lib/catalog";

import type { RequestHandler } from "./$types";
import type { ArticleIndex } from "$lib/types/article";

export const prerender = true;

/**
 * Return all entries
 */
export const GET: RequestHandler = async () => {
  const entries: ArticleIndex[] = await loadArticles();
  return json({ entries });
};
