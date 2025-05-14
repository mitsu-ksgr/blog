/*---------------------------------------------------------------------------
 * lib/feeder.ts
 *
 * Provides post feeds.
 *---------------------------------------------------------------------------*/
import { Feed } from "feed";
import { base } from "$app/paths";
import { loadArticles } from "$lib/catalog";

import type { Item as FeedItem } from "feed";
import type { ArticleIndex } from "$lib/types/article";

// TODO: from config file?
const BASE_URL = "https://www.ksgr.net";

export async function makeFeed(): Promise<Feed> {
  const feed = new Feed({
    title: "みつのーと",
    id: BASE_URL,
    link: BASE_URL,
    language: "ja",
    description: "mitsu's blog",
    favicon: `${base}/favicon.ico`,
    copyright: "© 2025 mitsu-ksgr",
  });

  const articles: ArticleIndex[] = await loadArticles();
  articles.forEach((art: ArticleIndex): void => {
    const item: FeedItem = {
      title: art.title,
      id: `${BASE_URL}${art.link}`,
      link: `${BASE_URL}${art.link}`,
      date: new Date(art.created),
    };

    feed.addItem(item);
  });

  return feed;
}
