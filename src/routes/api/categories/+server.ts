/*---------------------------------------------------------------------------
 * src/routes/api/categories/+server.ts
 *
 * Categories endpoints
 *---------------------------------------------------------------------------*/
import { json } from "@sveltejs/kit";
import { loadCategories } from "$lib/catalog";

import type { RequestHandler } from "./$types";
import type { Category } from "$lib/types/category";

export const prerender = true;

/**
 * Return all entries
 */
export const GET: RequestHandler = async () => {
  const categories: Category[] = await loadCategories();
  return json({ categories });
};
