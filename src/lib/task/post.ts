/*---------------------------------------------------------------------------
 * lib/task/post.ts
 *
 * Support make new post.
 *
 * $ node src/lib/task/post.js {slug} {date}
 * slug ... Alphabetic-only string literal.
 * date ... Use to specify the created date (default: now).
 *---------------------------------------------------------------------------*/
import fs from "fs";
import path from "path";

type PostInfo = {
  invalid_slug: boolean; // flag
  slug: string;
  date: Date;
};

function slugged(str: string): string {
  return str
    .replace(/\s+/g, "-")
    .replace(/_/g, "-")
    .replace(/[!$%^&@#*()+|~=`{}[\]:";'<>?,./]/g, "")
    .toLowerCase();
}

function parse_args(argv: Array<string>): PostInfo {
  let invalid_slug = true;
  let slug = "";
  let date: Date = new Date();

  // passed 'date'
  if (argv.length >= 4) {
    date = new Date(argv[3] as string);
  }
  // passed 'slug'
  if (argv.length >= 3) {
    slug = slugged(argv[2] as string);
    invalid_slug = false;
  }

  return {
    invalid_slug,
    slug,
    date,
  };
}

function makePostContent(args: PostInfo): string {
  return `---
title: "${args.slug.split("-").join(" ")}"
created: ${args.date.toISOString()}
categories: ["雑記"]
tags: ["雑記"]
---

New post!
`;
}

function makeFilePath(args: PostInfo): string {
  const y = `${args.date.getFullYear()}`;
  const m = `0${args.date.getMonth() + 1}`.slice(-2);
  const d = `0${args.date.getDate()}`.slice(-2);
  const date = [y, m, d].join("");
  const filename = `${date}_${args.slug}.md`;

  return ["contents", "articles", y, m, filename].join(path.sep);
}

//-----------------------------------------------------------------------------
//  Entrypoint
//-----------------------------------------------------------------------------
function main() {
  const args = parse_args(process.argv);

  // Validation.
  if (args.invalid_slug) {
    console.error("Error: No slug specified.");
    console.info("> npm src/lib/task/post.js {slug}");
    process.exit(1);
  }

  // Make new post
  const content = makePostContent(args);
  const file_path = makeFilePath(args);
  const dir_path = path.dirname(file_path);

  // Infomartion log
  console.log("\n* New post");
  console.log(`Slug: ${args.slug}`);
  console.log(`Date: ${args.date.toISOString()}`);
  console.log(`Path: ${file_path}`);
  console.log(`Dirs: ${dir_path}`);
  console.log("\n");

  // Make directories.
  fs.mkdirSync(dir_path, { recursive: true });

  if (fs.existsSync(file_path)) {
    console.error(
      `Error: Failed to create post file. ${file_path} is already exists!`,
    );
    process.exit(1);
  }

  // Make a post file.
  fs.writeFileSync(file_path, content);
  console.log(`Generated: ${file_path}`);
}

main();
