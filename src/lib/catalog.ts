/*---------------------------------------------------------------------------
 * lib/catalog.ts
 *
 * Provides catalog data.
 *---------------------------------------------------------------------------*/
import fs from "fs";

import type { ArticleIndex } from "$lib/types/article";
import type { Category } from "$lib/types/category";
import type { TagList } from "$lib/types/tag";

function loadJsonFile<T>(path: string): T {
  const data = fs.readFileSync(path, "utf-8");
  return JSON.parse(data) as T;
}

export function loadArticles(): ArticleIndex[] {
  return loadJsonFile<ArticleIndex[]>("contents/articles.json");
}

export function loadCategories(): Category[] {
  return loadJsonFile<Category[]>("contents/categories.json");
}

export function loadTags(): TagList {
  return loadJsonFile<TagList>("contents/tags.json");
}

export function loadArticleRoutes(): string[] {
  return loadJsonFile<string[]>("contents/article_routes.json");
}
