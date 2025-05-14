---
title: "Aseprite: UI フォントを変更する"
created: 2023-05-20T03:15:02.101Z
categories: ["note", "Aseprite"]
tags: ["note", "Aseprite"]
---


### 環境
- Debian 11
- Steam 経由でインストール
- Aseprite v1.3.5-x64
  - Install: `~/.local/share/Steam/steamapps/common/Aseprite`


### 1. fonts.xml を変更する

`Aseprite/data/fonts.xml` を編集する。
必要に応じてバックアップを取っておく。

以下の２つの要素を変更する。

・変更前
```xml
<font name="Aseprite"
      type="spritesheet"
      file="aseprite_font.png">
  <fallback font="Unicode" size="8" />
</font>

<font name="Aseprite Mini"
      type="spritesheet"
      file="aseprite_mini.png">
  <fallback font="Unicode" size="6" />
</font>
```

・変更後
```xml
<font name="Aseprite"
      type="truetype"
      file_win="Arial.ttf"
      file_mac="Arial Unicode.ttf"
      file_linux="DejaVuSans.ttf">
  <fallback font="Unicode" size="8" />
</font>

<font name="Aseprite Mini"
      type="truetype"
      file_win="Arial.ttf"
      file_mac="Arial Unicode.ttf"
      file_linux="DejaVuSans.ttf">
  <fallback font="Unicode" size="6" />
</font>
```


### 2. UI のスケールを変更する

- Aseprite を起動する
- Edit > Preferences で Preferences ダイアログを表示
- General タブで以下を変更
  - Screen Scaling: `200%` ---> `100%`
  - UI Elements Scaling: `100%` ---> `200%`


これでフォントが変更されたハズ。

### 参考
- [How to change UI font? \- Help \- Aseprite Community](https://community.aseprite.org/t/how-to-change-ui-font/5023)



