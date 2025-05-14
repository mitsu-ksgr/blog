---
title: "Aseprite: CLI からタイルマップを生成する"
created: 2023-05-20T03:49:21.002Z
categories: ["note", "Aseprite"]
tags: ["note", "Aseprite"]
---

### 環境
- Debian 11
- Steam 経由でインストール
- Aseprite v1.3.5-x64
  - Install: `~/.local/share/Steam/steamapps/common/Aseprite`


### 目標
- 複数の aseprite ファイルを１つのタイルマップにまとめる


### Aseprite を CLI で実行

Aseprite は `--batch` (`-b`) オプションを指定することで UI なしで実行できる。

Steam 経由の場合、 aseprite は以下のパスにインストールされてる。

```sh
~/.local/share/Steam/steamapps/common/Aseprite/aseprite
```

- [Aseprite \- Docs \- Cli](https://www.aseprite.org/docs/cli#sheet-pack)


### --sheet, --data

シンプルにパッキングするだけなら、
`--sheet` と `--data` を指定すればいい。

```sh
aseprite --batch image1.aseprite image2.aseprite --sheet tilemap.png --data tilemap.json
```


### サイズ指定

`--sheet-width`, `--sheet-height` でピクセル数を指定できる。

```sh
aseprite --batch *.aseprite \
  --sheet tilemap.png --data tilemap.json \
  --sheet-width 128 --sheet-height 128
```


### データ中のスプライト名を指定する

そのままだと `image1.aseprite` という名前になる。

`--filename-format` で色々指定できる。

```sh
aseprite --batch *.aseprite \
  --sheet tilemap.png --data tilemap.json \
  --filename-format '{title}'
```


### おわり
他にもいろいろできそう。

[Aseprite \- Docs \- Cli](https://www.aseprite.org/docs/cli#filename-format)


