//
//  eslint.config.js
//
//  https://eslint.org/docs/latest/use/configure/migration-guide
//

import js from "@eslint/js";
import parser from "@typescript-eslint/parser";
import pluginTs from "@typescript-eslint/eslint-plugin";
import pluginSvelte from "eslint-plugin-svelte";
import svelteParser from "svelte-eslint-parser";

export default [
  {
    // Ignroes
    ignores: [
      "node_modules",
      "build",
      ".svelte-kit",
      "package",
      ".env",
      ".env.*",
      "!.env.example",
      "pnpm-lock.yaml",
      "package-lock.json",
      "yarn.lock",
    ],
  },
  js.configs.recommended,
  {
    // TypeScript
    files: ["**/*.ts"],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
      globals: {
        console: "readonly",
        document: "readonly",
        process: "readonly",
        Response: "readonly",
        window: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": pluginTs,
    },
    rules: {
      ...pluginTs.configs.recommended.rules,
    },
  },
  {
    // Svelte
    files: ["**/*.svelte"],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser,
        extraFileExtensions: [".svelte"],
        ecmaVersion: 2020,
        sourceType: "module",
      },
      globals: {
        console: "readonly",
        document: "readonly",
        window: "readonly",
        Event: "readonly",
        HTMLElement: "readonly",
        HTMLButtonElement: "readonly",
        URL: "readonly",
      },
    },
    plugins: {
      svelte: pluginSvelte,
    },
    rules: {
      ...pluginSvelte.configs.recommended.rules,
      "no-self-assign": "off",
    },
  },
];
