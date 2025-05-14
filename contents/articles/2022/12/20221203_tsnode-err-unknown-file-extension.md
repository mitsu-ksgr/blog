---
title: "ts-node: ERR_UNKNOWN_FILE_EXTENSION"
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

`yarn ts-node src/lib/task/sample.ts` を実行した際に、
`ERR_UNKNOWN_FILE_EXTENSION` エラーに遭遇した。

```sh
$ yarn ts-node src/lib/task/sample.ts

yarn run v1.22.18
$ /app/node_modules/.bin/ts-node src/lib/task/sample.ts
TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /app/src/lib/task/sample.ts
    at new NodeError (node:internal/errors:372:5)
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:76:11)
    at defaultGetFormat (node:internal/modules/esm/get_format:118:38)
    at defaultLoad (node:internal/modules/esm/load:21:20)
    at ESMLoader.load (node:internal/modules/esm/loader:407:26)
    at ESMLoader.moduleProvider (node:internal/modules/esm/loader:326:22)
    at new ModuleJob (node:internal/modules/esm/module_job:66:26)
    at ESMLoader.#createModuleJob (node:internal/modules/esm/loader:345:17)
    at ESMLoader.getModuleJob (node:internal/modules/esm/loader:304:34)
    at async Promise.all (index 0) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```


### 対応

`tsconfig.json` に設定を追加したところ、動作するようになった。

```jsonc
{
    "compilerOptions": {
        //....
    },

    // ↓ 以下を追加
    "ts-node": {
        "esm": true
    }
}
```


##### 対応２

この記事にまとめている途中で、 `tsconfig.json` に追記する代わりに
`--esm` オプションを利用する方法を見かけた。

```sh
$ ts-node --esm ./sample.ts
```

試してないけど参考までに。



### 原因

`package.json` で `"type": "module"` を指定している場合にこのエラーになりがちなようだけど、

- `tsconfig.json` や `package.json` の他の設定にも寄りそう
- 忙しいし、取り敢えず動いたからええか

という感じで原因の特定まではしてない……🙃。


参考： https://github.com/TypeStrong/ts-node/issues/1007

気になる場合、↑ の issue を眺めれば色々わかりそう。

