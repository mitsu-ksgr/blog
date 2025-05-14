/*---------------------------------------------------------------------------
 * lib/md_loader.ts
 *
 * Find / List / Load the markdown file.
 *---------------------------------------------------------------------------*/
import fs from "fs";
import path from "path";

import fm from "front-matter";
import { marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from 'highlight.js';

import type { FrontMatterResult } from "front-matter";
import type { Token, Tokens } from "marked";
import type { Headline, Article, FrontMatter } from "./types/article";

// contents/articles/{year}/{month}/{date}_{slug}.md
const CONTENTS_DIR_PATH = "contents/articles";

/**
 *  Setup marked.
 */
// Highlight
marked.use(
  markedHighlight({
    emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight(code, lang, info) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    }
  }),
);

// Renderer
// https://marked.js.org/using_pro#renderer
const renderer = {
  heading(this: any, token: Tokens.Heading): string {
    const text: string = this.parser.parseInline(token.tokens);
    const slug = slugify(text);
    const depth = token.depth;
    return `<h${depth} id="${slug}">${text}</h${depth}>`;
  }
};

marked.use({ renderer });

/**
 * Make a slug for anchors.
 *
 * @param {string}  text
 */
function slugify(text: string): string {
  return text
    .replace(/\s+/g, "-")
    .replace(/[!$%^&@#*()+|~=`{}[\]:";'<>?,./]/g, "")
    .toLowerCase();
}

/**
 * Make a file path string based on given parameters.
 *
 * @param {string}    date  the date string in the format "YYYYMMDD"
 * @param {string}    slug  slug string
 * @return {?string}  File path. if parameter is invalid, return null.
 */
function makeFilePath(date: string, slug: string): string | null {
  if (date.length !== 8) return null;
  if (!/^\d+$/.test(date)) return null;

  const y = date.slice(0, 4);
  const m = date.slice(4, 6);

  return path.join(CONTENTS_DIR_PATH, y, m, `${date}_${slug}.md`);
}

/**
 * Build the ToC.
 * Thanks to: https://the2g.com/post/marked-toc
 *
 * @param {Token[]} tokens  token list.
 * @return {Headline[]} ToC
 */
function makeToC(tokens: Token[]): Headline[] {
  return tokens.reduce<Headline[]>((result: Headline[], token: Token) => {
    if (token.type !== "heading") return result;

    const heading = token as Token & { text: string; depth: number };
    const anchor = slugify(heading.text);

    result.push({
      title: heading.text,
      anchor: `#${anchor}`,
      depth: heading.depth,
    });
    return result;
  }, []);
}

/**
 *  Get all markdown file paths recursive from dir_path.
 *
 *  @param {string} dir_path
 */
export function getAllMarkdownFiles(dir_path = CONTENTS_DIR_PATH): string[] {
  const walk = (dir: string): string[] => {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap(ent => {
      const filepath = path.join(dir, ent.name);
      if (ent.isDirectory()) return walk(filepath);
      if (ent.isFile()) return [filepath];
      return [];
    });
  };
  return walk(dir_path);
}

/**
 * Load the front matter of the markdown file.
 *
 * @param {string}  md_path file path
 */
export function readMarkdownFrontMatter(md_path: string): FrontMatter | null {
  try {
    const file = fs.readFileSync(md_path, "utf-8");
    const fmatter: FrontMatterResult<FrontMatter> = fm<FrontMatter>(file);
    return fmatter.attributes;
  } catch (err) {
    console.warn(`Warn: Failed to load file: ${md_path}`, err);
    return null; // File not found.
  }
}

/**
 * Find the markdown file related with the given parameters.
 *
 * @param {string}    date  the date string in the format "YYYYMMDD"
 * @param {string}    slug  slug string
 * @return {?string}  File path. if the file cannot be found, return null.
 */
export function findMarkdownFile(date: string, slug: string): string | null {
  const md_path = makeFilePath(date, slug);
  if (md_path === null) return null;
  if (!fs.existsSync(md_path)) return null;
  return md_path;
}

/**
 * Load article data from the markdown file.
 *
 * @param {string}  md_path Path to markdown file.
 * @returns {Article?} article data.
 */
export function loadArticle(md_path: string): Article | null {
  try {
    const file = fs.readFileSync(md_path, "utf-8");
    const contents: FrontMatterResult<FrontMatter> = fm<FrontMatter>(file);
    const tokens = marked.lexer(contents.body);
    const toc = makeToC(tokens);

    return {
      fm: contents.attributes,
      toc: toc,
      body: marked.parser(tokens),
    };
  } catch (err) {
    console.warn(`Failed to parse article: ${md_path}`, err);
    return null; // File not found.
  }
}
