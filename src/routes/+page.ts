/*---------------------------------------------------------------------------
 * src/routes/+page.ts
 *
 * Top page load function
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
