---
title: "ts-node: ERR_MODULE_NOT_FOUND"
created: 2022-12-03T00:00:00.000Z
categories: ["tech", "TypeScript"]
tags: ["tech", "TypeScript"]
---


### 環境
- SvelteKit プロジェクト内（Vite環境）
- yarn
- TypeScript 4.9
- ts-node 10.9.1


### エラー内容

```ts
import { hogeFunction } from "../hoge";
```

という import 文を書いたところ、 `ERR_MODULE_NOT_FOUND` エラーと遭遇。

```sh
yarn run v1.22.18
$ ts-node src/lib/task/sample.ts
/app/node_modules/ts-node/dist-raw/node-internal-modules-esm-resolve.js:366
    throw new ERR_MODULE_NOT_FOUND(
          ^
CustomError: Cannot find module '/app/src/lib/hoge' imported from /app/src/lib/task/sample.ts
    at finalizeResolution (/app/node_modules/ts-node/dist-raw/node-internal-modules-esm-resolve.js:366:11)
    at moduleResolve (/app/node_modules/ts-node/dist-raw/node-internal-modules-esm-resolve.js:801:10)
    at Object.defaultResolve (/app/node_modules/ts-node/dist-raw/node-internal-modules-esm-resolve.js:912:11)
    at /app/node_modules/ts-node/src/esm.ts:218:35
    at entrypointFallback (/app/node_modules/ts-node/src/esm.ts:168:34)
    at /app/node_modules/ts-node/src/esm.ts:217:14
    at addShortCircuitFlag (/app/node_modules/ts-node/src/esm.ts:409:21)
    at resolve (/app/node_modules/ts-node/src/esm.ts:197:12)
    at resolve (/app/node_modules/ts-node/src/child/child-loader.ts:15:39)
    at ESMLoader.resolve (node:internal/modules/esm/loader:580:30)
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

何も考えず「拡張子付けないといかんのかな」と思い、試しに `.ts` を付与して、
以下のように書き直してみました。

```ts
import { hogeFunction } from "../hoge.ts";
```

すると、エラー内容が以下のように変化。

```sh
yarn run v1.22.18
$ ts-node src/lib/task/sample.ts
/app/node_modules/ts-node/src/index.ts:859
    return new TSError(diagnosticText, diagnosticCodes, diagnostics);
           ^
TSError: ⨯ Unable to compile TypeScript:
src/lib/task/sample.ts:9:62 - error TS2691: An import path cannot end with a '.ts' extension. Consider importing '../hoge.js' instead.

9 import { getAllMarkdownFiles, readMarkdownFrontMatter } from "../hoge.ts";
                                                               ~~~~~~~~~~~~~~~~~

    at createTSError (/app/node_modules/ts-node/src/index.ts:859:12)
    at reportTSError (/app/node_modules/ts-node/src/index.ts:863:19)
    at getOutput (/app/node_modules/ts-node/src/index.ts:1077:36)
    at Object.compile (/app/node_modules/ts-node/src/index.ts:1433:41)
    at transformSource (/app/node_modules/ts-node/src/esm.ts:400:37)
    at /app/node_modules/ts-node/src/esm.ts:278:53
    at async addShortCircuitFlag (/app/node_modules/ts-node/src/esm.ts:409:15)
    at async ESMLoader.load (node:internal/modules/esm/loader:407:20)
    at async ESMLoader.moduleProvider (node:internal/modules/esm/loader:326:11)
    at async link (node:internal/modules/esm/module_job:70:21) {
  diagnosticCodes: [ 2691 ]
}
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```


### 対応

エラーメッセージに
「import path は `.ts` にできないから、代わりに `.js` を指定してみて」
とあるので、そのようにしたところ解決した。

```ts
import { hogeFunction } from "../hoge.js";
```


### 原因

- 相対パスで import する場合、拡張子付きの完全なパスが必要
- tsc は、出力後の拡張子を求める
- よって `.ts` ではなく `.js` を指定する必要がある

ということらしい。

参考： https://github.com/TypeStrong/ts-node/issues/1736#issuecomment-1112872276

