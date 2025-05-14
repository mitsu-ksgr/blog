/*---------------------------------------------------------------------------
 * svelte.config.js
 *
 *---------------------------------------------------------------------------*/
import adapter from "@sveltejs/adapter-static";
import preprocess from "svelte-preprocess";
import fs from "fs";

const is_prod = process.env.NODE_ENV === "production";

/**
 * Return prerendering pages
 */
function getPrerenderEntries() {
  let list = ["*"];
  if (is_prod) {
    const data = fs.readFileSync("contents/article_routes.json", "utf-8");
    const routes = JSON.parse(data);

    // routes は '/blog/' (paths.base) を含むルートを返す。
    // しかし prerender.entries には paths.base を含まないルートを渡す必要がある。
    // そのためここで `/blog/` を削除したルートに変換する。
    list = list.concat(routes.map((route) =>
      route.startsWith("/blog/") ? route.slice(5) : route
    ));
  }
  return list;
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    paths: {
      base: "/blog",
    },
    adapter: adapter(),
    prerender: {
      entries: getPrerenderEntries(),
    },
  },
};

export default config;
