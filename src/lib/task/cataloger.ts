/*---------------------------------------------------------------------------
 * lib/task/cataloger.ts
 *
 * Generate catalog files.
 *---------------------------------------------------------------------------*/
import fs from "fs";
import path from "path";

import { getAllMarkdownFiles, readMarkdownFrontMatter } from "../md_loader.js";

import type { ArticleIndex } from "../types/article";
import type { Category } from "../types/category";
import type { Tag, TagList } from "../types/tag";

/**
 * ref: svelte.config.js
 */
const BASE_PATH = "/blog";

/**
 * Save data as json file.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveFile(file_path: string, data: any): boolean {
  try {
    fs.writeFileSync(file_path, JSON.stringify(data, null, 0));
  } catch (e) {
    console.error(e);
    return false;
  }
  return true;
}

/**
 * Make the list of markdown files.
 */
function makeArticleIndexList(): Array<ArticleIndex> {
  // Get markdown file list.
  let files = [];
  try {
    files = getAllMarkdownFiles();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }

  if (files.length === 0) {
    console.log("Article file not found.");
    return [];
  }

  // Collect the front-matter of the markdown file.
  const ret: Array<ArticleIndex> = [];
  for (const file_path of files) {
    const name = file_path.split(path.sep)[4]; // ['contents','entry',year,month,filename]
    if (name === undefined || name === null) {
      console.warn(`Warn: Failed to load file: ${file_path}`);
      continue;
    }

    const slug = name.slice(9).slice(0, -3); // 9='20220101_', -3='.md'
    const date = name.slice(0, 8);

    console.log(`Load: ${file_path}`);
    const matter = readMarkdownFrontMatter(file_path);
    if (matter === null) {
      console.warn(`Warn: Failed to load front-matter from ${file_path}`);
      continue;
    }

    ret.push({
      // File params
      file_path: file_path,
      file_name: name,
      file_date: date,
      file_slug: slug,

      // Front matter
      ...matter,

      // For blog
      link: `${BASE_PATH}/entry/${date}/${slug}`,
    });
  }

  return ret;
}

/**
 * Make category list.
 */
function makeCategoryList(index: Array<ArticleIndex>): Array<Category> {
  const clist: Array<Category> = [];
  const uncat: Category = {
    name: "未分類",
    articles: [],
    children: [],
  };

  for (const ai of index) {
    const cats = ai.categories;

    // Uncategory
    if (cats.length <= 0) {
      uncat.articles.push(ai);
      continue;
    }

    // Categorize
    let ptr: Array<Category> = clist;
    cats.forEach((cat, idx) => {
      let c: Category | undefined = ptr.find(item => item.name === cat);

      // Register a new category.
      if (c === undefined) {
        c = { name: cat, articles: [], children: [] };
        ptr.push(c);
      }

      // if last, register an article.
      if (idx === cats.length - 1) {
        c.articles.push(ai);

        // Next.
      } else {
        ptr = c.children;
      }
    });
  }

  if (uncat.children.length > 0) {
    clist.push(uncat);
  }

  return clist;
}

/**
 *  Make tag list.
 */
function makeTagList(index: Array<ArticleIndex>): TagList {
  return {
    articles: index,
    tags: index.reduce((tags: Array<Tag>, ai, idx): Array<Tag> => {
      for (const tag of ai.tags) {
        let t: Tag | undefined = tags.find(item => item.name === tag);
        if (t === undefined) {
          t = { name: tag, indexes: [] };
          tags.push(t);
        }
        t.indexes.push(idx);
      }
      return tags;
    }, []),
  };
}

/**
 * Make all article routes.
 */
function makeArticleRoutesList(index: Array<ArticleIndex>): Array<string> {
  return index.map(a => `${BASE_PATH}/entry/${a.file_date}/${a.file_slug}`);
}

//-----------------------------------------------------------------------------
//  Entrypoint
//-----------------------------------------------------------------------------
function main() {
  // Make index.
  const index = makeArticleIndexList();

  // Generate the article list.
  const articles_path = "contents/articles.json";
  if (saveFile(articles_path, index)) {
    console.log(`Generated: ${articles_path}`);
  }

  // Generate the category index.
  const category_path = "contents/categories.json";
  if (saveFile(category_path, makeCategoryList(index))) {
    console.log(`Generated: ${category_path}`);
  }

  // Generate the tag index.
  const tags_path = "contents/tags.json";
  if (saveFile(tags_path, makeTagList(index))) {
    console.log(`Generated: ${tags_path}`);
  }

  // Generate the routes list.
  const routes_path = "contents/article_routes.json";
  if (saveFile(routes_path, makeArticleRoutesList(index))) {
    console.log(`Generated: ${routes_path}`);
  }
}

main();
