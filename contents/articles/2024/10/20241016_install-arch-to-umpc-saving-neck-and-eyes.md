---
title: "UMPC に Arch をインストールするときに目と首を守る方法"
created: 2024-10-16T23:54:13.895Z
categories: ["tech", "UMPC"]
tags: ["tech", "UMPC", "GPD Pocket", "Arch linux"]
---

UMPC (GPD Pocket とか) に Arch Linux をインストールするときに、
フォントと画面の回転を調整する方法。


### フォントサイズを倍にする
```sh
$ setfont -d
```

これで目が楽になる。


### 画面を回転させる
```sh
$ echo 1 > /sys/class/graphics/fbcon/rotate_all
```

これで首が楽になる。

もし回転方向がおかしい場合は `0` ~ `3` の値を試して調整する。


### だいぶ良くなる

よくなる！


### 参考
- [How do we increase font size in the Arch installation prompt and in a TTY? : r/linuxquestions](https://www.reddit.com/r/linuxquestions/comments/uu5vv2/how_do_we_increase_font_size_in_the_arch/)
- [Wrong screen rotation on Arch install : r/archlinux](https://www.reddit.com/r/archlinux/comments/rde02y/wrong_screen_rotation_on_arch_install/)


