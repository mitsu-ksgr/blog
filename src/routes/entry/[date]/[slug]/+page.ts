/*---------------------------------------------------------------------------
 * routes/entry/[date]/[slug]/+page.ts
 *
 * [date] ... 20211218
 * [slug] ... title
 *---------------------------------------------------------------------------*/
import { error } from "@sveltejs/kit";
import { base } from "$app/paths";

export async function load({ params, fetch }) {
  const url = `${base}/api/article/${params.date}/${params.slug}`;

  const resp = await fetch(url);
  if (resp.ok) {
    return await resp.json();
  }

  console.log(`entry/d/s/+page.ts: fetch failed (${resp.status})`);

  // TODO: use resp.status?
  throw error(404, "Not found (つ﹏<。)");
}
