---
title: "Windows10: 自作 PropertyHandler 実装メモ"
created: 2022-05-07T00:00:00.000Z
categories: ["tech", "Windows"]
tags: ["tech", "Windows", "やった"]
---

Windows Explorer の詳細タブのサイズ表記が KB 固定なのが気に入らなくて、
いろいろ試してみたけど諦めたときのメモ。

結果としては断念という形になった……。


### 動機
- Windows Explorer のサイズ表記が KB 固定なのがツラい
  - `ls` の `--human-readable` が欲しい
- できれば別のソフトウェアは入れたくない
- これぐらい自分でもサクッとできるのでは？って気がした

（というかこれくらい標準でやってほしい……）


### 記録
#### 環境
- Windows 10


#### PropertyHandler
- ファイルからプロパティを取り出すやつ
- Windows Explorer の詳細タブは PropertyHandler を介して情報を表示している
- PropertyHandler は拡張子に紐付ける


#### 試したこと
- サイズに応じた表記をする PropertyHandler を実装
- `propdesc` を用意して、自作 PropertyHandler を登録

コードは GitHub においてあります。

https://github.com/mitsu-ksgr/SmartSizePropertyHandler


#### 結果
- PropertyHandler は各拡張子につき１つしか登録できない
- そのため、自作の PropertyHandler を登録すると、デフォルトのものが無効になってしまう
  - mp4 だと「長さ」とかがみれなくなる
- 悲しい

PropertyHandler を紐付けた拡張子については、サイズ表記問題は解決できたけれど、
以前は見えていた他のプロパティが見れなくなってしまう結果になった。

この辺りで面倒になってきて諦めた 😐

