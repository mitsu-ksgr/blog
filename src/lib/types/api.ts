/*---------------------------------------------------------------------------
 * src/lib/types/api.ts
 *
 * API Response
 *---------------------------------------------------------------------------*/
import type { Article, ArticleIndex } from "./article";
import type { Category } from "./category";
import type { TagList } from "./tag";

// api/entries
export type EntriesResponse = {
  entries: ArticleIndex[];
};

// api/categories
export type CategoriesResponse = {
  categories: Category[];
};

// api/article/[date]/[slug]
export type ArticleResponse = {
  article: Article;
};

// api/tags
export type TagsResponse = {
  taglist: TagList;
};
