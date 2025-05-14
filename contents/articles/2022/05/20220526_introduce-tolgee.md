---
title: "Tolgee: 翻訳管理ツール"
created: 2022-05-26T00:00:00.000Z
categories: ["tech", "tolgee"]
tags: ["tech", "i18n", "tolgee"]
---

### Tolgee

シンプルな翻訳管理ツール。の紹介。

- https://tolgee.io/
- GitHub: https://github.com/tolgee/tolgee-platform
- Docker: https://hub.docker.com/r/tolgee/tolgee

ぼくは OSS 版を利用させてもらったけど、
公式サイトでユーザー登録することで、
クラウドサービスとして利用こともできるみたい。

翻訳データはプロジェクトベースで管理し、
翻訳作業はチームで行うことができる。


### Docker で試す

Docker イメージが公開されているので、それを使うと楽。

```sh
$ mkdir tolgee_data
$ docker run -v tolgee_data:/data/ -p 8085:8080 tolgee/tolgee

# Open: http://localhost:8085/
```

シンプルな UI なので、サクッと使い始めることができた。

何らかの都合で公式サービスが利用できない場合は、
このイメージを任意のクラウドサービスで動かして使うこともできそう。


### 翻訳データ

翻訳データは Export ページから JSON で出力できる。

また、Tolgee をクラウドサービスとして利用している場合、
API を通して翻訳データを配信することもできるっぽい。

React, Vue, Svelte など、いくつか流行りのフレームワークについては、
Tolgee API を利用するコードも併せて出力してくれる。

そのようなフレームワークを使ってるなら API 経由の利用も簡単に開始できそう。


