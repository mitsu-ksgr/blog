/*---------------------------------------------------------------------------
 * routes/api/article/[date]/[slug]/+server.ts
 *
 * Return blog content.
 *---------------------------------------------------------------------------*/
import { error, json } from "@sveltejs/kit";
import { findMarkdownFile, loadArticle } from "$lib/md_loader";

import type { RequestHandler } from "./$types";

export const prerender = true;

export const GET: RequestHandler = async ({ params }) => {
  const { date, slug } = params;

  const mdPath = findMarkdownFile(date, slug);
  if (mdPath === null) {
    throw error(404, "404 not found");
  }

  const article = loadArticle(mdPath);
  if (article === null) {
    throw error(500, "oops!");
  }

  return json({ article });
};
