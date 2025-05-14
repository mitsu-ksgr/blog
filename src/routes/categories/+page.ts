/*---------------------------------------------------------------------------
 * src/routes/categories/+page.ts
 *
 * Category page load function
 *---------------------------------------------------------------------------*/
import { error } from "@sveltejs/kit";
import { base } from "$app/paths";

export async function load({ fetch }) {
  const resp = await fetch(`${base}/api/categories`);
  if (resp.ok) {
    return await resp.json();
  }

  // TODO: use resp.status?
  throw error(404, "Not found (つ﹏<。)");
}
