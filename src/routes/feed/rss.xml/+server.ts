/*---------------------------------------------------------------------------
 * routes/feed/rss.xml/+server.ts
 *
 * Return rss.xml endpoint.
 *---------------------------------------------------------------------------*/
import { makeFeed } from "$lib/feeder";

export const prerender = true;

export async function GET({ setHeaders }) {
  setHeaders({
    "Cache-Control": "max-age=0, s-max-age=600",
    "Content-Type": "application/xml",
  });

  const feed = await makeFeed();
  return new Response(feed.rss2());
}
