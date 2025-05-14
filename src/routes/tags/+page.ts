/*---------------------------------------------------------------------------
 * src/routes/tags/+page.ts
 *
 * Tag page load function
 *---------------------------------------------------------------------------*/
import { error } from "@sveltejs/kit";
import { base } from "$app/paths";

export async function load({ fetch }) {
  const resp = await fetch(`${base}/api/tags`);
  if (resp.ok) {
    return await resp.json();
  }

  // TODO: use resp.status?
  throw error(404, "Not found (つ﹏<。)");
}
