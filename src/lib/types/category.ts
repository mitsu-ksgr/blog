/*---------------------------------------------------------------------------
 * src/lib/types/category.ts
 *
 * Model: Category
 *---------------------------------------------------------------------------*/
import type { ArticleIndex } from "./article";

export type Category = {
  name: string;
  articles: ArticleIndex[];
  children: Category[];
};
