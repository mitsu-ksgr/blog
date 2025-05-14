---
title: "xdg-open のデフォルトアプリを変更する"
created: 2024-03-05T03:37:22.233Z
categories: ["tech"]
tags: ["tech", "xdg-open", "xdg-mime"]
---

xdg-open でディレクトリを指定したときに
VSCode が起動して不便だったから、
それを Thunar に変更した。

そのときの設定メモ。

今回はディレクトリ（`./`）を例にしてある。


### 環境
```
Debian GNU/Linux 11 (bullseye)
```


### Filetype と現在のデフォルトアプリの確認

`xdg-mime` コマンドで、開きたいファイルの Filetype を確認する。
（ない場合 `xdg-utils` でインストールする）

```sh
$ xdg-mime query filetype .
inode/directory
```

Filetype に紐づいたアプリを確認する。

```sh
$ xdg-mime query default inode/directory
code.desktop
```


### アプリを設定する

同様に `xdg-mime` コマンドで設定する。
今回は thunar で開きたいので `thunar.desktop` を指定。

```sh
$ xdg-mime default thunar.desktop inode/directory

# 確認
$ xdg-mime query default inode/directory
thunar.desktop
```

これで指定したアプリが起動するようになったハズ。


