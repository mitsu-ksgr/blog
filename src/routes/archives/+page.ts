/*---------------------------------------------------------------------------
 * src/routes/archives/+page.ts
 *
 * Define the load function for the archive page.
 *---------------------------------------------------------------------------*/
import { error } from "@sveltejs/kit";
import { base } from "$app/paths";

export async function load({ fetch }) {
  const resp = await fetch(`${base}/api/entries`);
  if (resp.ok) {
    return await resp.json();
  }

  // TODO: use resp.status?
  throw error(404, "Not found (つ﹏<。)");
}
