/*---------------------------------------------------------------------------
 * src/lib/types/article.ts
 *
 * Model: Article
 *---------------------------------------------------------------------------*/
export type FrontMatter = {
  title: string;
  created: string; // ISO 8601
  updated?: string; // ISO 8601
  categories: string[];
  tags: string[];
};

export type Headline = {
  title: string;
  anchor: string;
  depth: number;
};

export type Article = {
  fm: FrontMatter;
  toc: Headline[];
  body: string;
};

export type ArticleIndex = {
  // File attributes
  file_path: string;
  file_name: string;
  file_date: string; // 20221218
  file_slug: string;

  // Article Info
  link: string;
} & FrontMatter;
