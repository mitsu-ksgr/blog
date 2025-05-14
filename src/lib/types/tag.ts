/*---------------------------------------------------------------------------
 * src/lib/types/tag.ts
 *
 * Model: Tag
 *---------------------------------------------------------------------------*/
import type { ArticleIndex } from "./article";

export type Tag = {
  name: string;
  indexes: number[]; // index of TagList.articles
};

export type TagList = {
  articles: ArticleIndex[];
  tags: Tag[];
};
