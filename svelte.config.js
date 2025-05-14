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
const getPrerenderEntries = async () => {
  let list = ["*"];
  if (is_prod) {
    const routes = await JSON.parse(
      fs.readFileSync("contents/article_routes.json", "utf-8"),
    );
    list = list.concat(routes);
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
      entries: await getPrerenderEntries(),
    },
  },
};

export default config;
