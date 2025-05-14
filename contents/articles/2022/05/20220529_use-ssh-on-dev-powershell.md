---
title: "Developer PowerShell for VS 2022 で ssh を使う"
created: 2022-05-29T00:00:00.000Z
categories: ["tech", "Windows"]
tags: ["tech", "Windows", "PowerShell", "ssh"]
---

OpenSSH クライアントはインストールされているハズなのに、
なぜか Developer PowerShell 上で ssh を利用できなかった。

それに対処したときのメモ。


### 環境
- OS
    - Edition: Windows 10 Pro
    - Version: 21H1
- アプリ
    - "OpenSSH クライアント" はインストール済み
        - 「設定 > アプリ > アプリと機能 > オプション機能」で確認できるやつ
- Visual Studio 2022 インストール済み
  - 一緒にインストールされた Developer PowerShell for VS 2022 上での話


### 結論
`c:\windows\sysnative\openssh` を Path に追加する。

`$env:Path += ';c:\windows\sysnative\openssh'`


### 原因、というか謎
色々となんだかよく分からなかったので、
なんだかよく分からなかったことを書き残しておく。

Explorer で ssh.exe を探してみると、

`C:\Windows\System32\OpenSSH\ssh.exe`

が見つかった。<br>
しかし、そこにパスを通しても ssh は使えない……。

なぜかは分からないけど、PowerShell 上で
`C:\Windows\System32\OpenSSH`
へ移動しようとしても、

`Set-Location: Cannot find path 'C:\Windows\System32\OpenSSH' because it does not exist.`

といわれて移動できない。

ググってみたところ、似たような問題の issue がヒットした。

https://github.com/microsoft/terminal/issues/4682#issuecomment-589857917

ここで、

- 「`C:\Windows\sysnative\openssh\ssh.exe` だと動く？」
- 「うごいてるっぽい」

といったようなやり取りを発見。<br>
藁にすがる思いで同じように試したところ、ぼくの環境でも動いた。

やったね 🤢

あまり windows 上に開発環境整えるつもりもなく、
とりあえず動けばいいやって気持ちだったので、これでヨシとした。

ので、上記 issue もちゃんと読んでないし、
なんでパスがこうなってるのかも分かってない 🥺


### おまけ

#### git で使う

そもそも git で ssh 接続がしたかった。<br>
ついでなので ssh-agent まわりの設定もメモ。

いつもどおり、 windows 環境に振り回されてますゆえ、
読む場合はそのへんを前提に……。


#### ssh-agent
ssh-agent サービスはデフォルトだと無効になってるので、
手動で起動できるように変更する。

```powershell
Get-Service ssh-agent | Set-Service -StartupType Manual
```

起動。

```powershell
Start-Service ssh-agent
```

これで ssh-add ができるようになる。

が、このままだと、 ssh-add したにも関わらず、
git で ssh 接続が必要になるたびにパスワードを聞かれてしまう。

どういう理屈か分からなんけど、
git の sshCommand を指定してあげれば解決するっぽい。

```powershell
git config --global core.sshCommand C:/Windows/System32/OpenSSH/ssh.exe
```

ssh.exe のパスが<br>
`C:/Windows/System32/OpenSSH/ssh.exe`<br>
となっていることに注意。

先ほどの sysnative のほうを指定しても「そんなものはない」といわれてエラーになる。

謎。

まあとにかくこれで解決？したのでヨシ🤮

