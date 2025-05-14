---
title: "Windows 上で Qt5 をソースからビルドしたときのメモ"
created: 2022-05-28T00:00:00.000Z
categories: ["tech", "Windows"]
tags: ["tech", "Qt", "Windows"]
---

Windows 上で Qt5 をソースからビルドし、開発環境を構築したときのメモ。

- 基本的に作業メモ
- ちゃんと理解してない部分が多い
- 普段 windows 上で開発してないので、こなれていない
- ぼくはこの手順を踏んで20時間くらい掛かった

という感じだけど、
誰かにとって何かのヒントになる可能性があるかもなので、
ここに残しておく。

基本的にツラいので、こだわりがない方はアカウント登録して
ビルド済みのバイナリをダウンロードすることをオススメします。


## 環境＆前提
- Windows 10 Pro
  - core: Ryzen 5 3500 6core 3.60GHz
  - RAM: 32.0 GB
- Qt5 を OpenSource 版としてビルド
- Requirements
  - Visual Studio C++ 2022
  - git
  - Python
    - MSStore の python ページからインストールしたものを使用
  - Perl
    - https://strawberryperl.com/ を使用
  - Ruby
    - WebKit 使うなら必要っぽいけど、今回はいれてない


この記事を書いている時点では、
もう Windows 機はゲーム専用機に戻ってて、
~~いろいろ立ち上げて調べるのが面倒なので~~
細かいバージョンなどが抜けてます。

スミマセン……🙇‍♀️



## Qt5 をビルドする

参考: https://wiki.qt.io/Building_Qt_5_from_Git#Getting_the_source_code

上記リンク先を参考に進める。


### ビルド環境設定スクリプトを用意する

Qt のビルド環境をセットアップするためのスクリプトを用意する。

https://wiki.qt.io/Building_Qt_5_from_Git#Windows

上記リンク先の環境設定スクリプトを参考に、
自分の環境にあったスクリプトを作成していく。


リンク先からの変更点は以下のとおり。

- 4行目: `vcvarsall.bat` のパスとアーキテクチャ指定
```diff
- CALL "C:\Program Files (x86)\Microsoft Visual Studio 14.0\VC\vcvarsall.bat" <arch>
+ CALL "C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Auxiliary\Build\vcvarsall.bat" x86
```

- 7行目: Qt のソースコードのパス
  - まだ git clone 前なので、ソースコードを配置する予定のパスで大丈夫
  - ぼくの場合、ビルドは qt5 のソースとは別ディレクトリで行ったので、
    - ソースコード ... `〜〜\qt\qt5`
    - ビルドディレクトリ ... `〜〜\qt\qt5-build`
    - というディレクトリ関係になってる。
      - `C:\Users\mitsu\Documents\dev\qt` ディレクトリは別途作成した
  - 自分の環境・やり方にあったパスを設定してください
```diff
- SET _ROOT=C:\qt5
+ SET _ROOT=C:\Users\mitsu\Documents\dev\qt\qt5
```

ファイル名は wiki に則って `qt5vars.bat` にした。

ぼくの環境での完成形は以下のとおり。

```qt5vars.bat
@echo off

REM Set up \Microsoft Visual Studio 2015, where <arch> is \c amd64, \c x86, etc.
CALL "C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Auxiliary\Build\vcvarsall.bat" x86

REM Edit this location to point to the source code of Qt
SET _ROOT=C:\Users\mitsu\Documents\dev\qt\qt5

SET PATH=%_ROOT%\qtbase\bin;%_ROOT%\gnuwin32\bin;%PATH%

REM Uncomment the below line when using a git checkout of the source repository
SET PATH=%_ROOT%\qtrepotools\bin;%PATH%

REM Uncomment the below line when building with OpenSSL enabled. If so, make sure the directory points
REM to the correct location (binaries for OpenSSL).
REM SET PATH=C:\OpenSSL-Win32\bin;%PATH%

REM When compiling with ICU, uncomment the lines below and change <icupath> appropriately:
REM SET INCLUDE=<icupath>\include;%INCLUDE%
REM SET LIB=<icupath>\lib;%LIB%
REM SET PATH=<icupath>\lib;%PATH%

REM Contrary to earlier recommendations, do NOT set QMAKESPEC.

SET _ROOT=

REM Keeps the command line open when this script is run.
cmd /k
```

このスクリプトを PowerShell 上で実行すると、
インタラクティブシェルがコマンドプロンプトに切り替わる（最後の `cmd /k` ）。

今後の作業は立ち上がったコマンドプロンプト上で行っていく。


### ソースコードを入手する

今回は5.15 をチェックアウトした。

- https://code.qt.io/cgit/qt/qt5.git/

前回の手順で立ち上がったコマンドプロンプト上で、
ソースコードをクローンしたいディレクトリに移動する。

ぼくの環境の場合では、
`C:\Users\mitsu\Documents\dev\qt` ディレクトリに移動して作業をした。

```cmd
git clone git://code.qt.io/qt/qt5.git
cd qt5

git fetch origin 5.15
git checkout 5.15
```

### サブモジュールのソースコードを取得する

サブモジュールをクローンする。

何も考えずに実行したところ、14時間くらい掛かったので注意。
（時間掛かるなぁと思って放置して寝たけど、起きても終わってなかった）。

```cmd
perl init-repository
```

大量のクローンを行う上に、
おそらくサーバ側の速度が出てない(80KiB/s くらいだった)のが原因な気がする。

init-repository は perl スクリプトなので、
わかる人は shallow-clone するように変更するのにチャレンジしてもよさそう。<br>
（init-repository にはいくつかオプションもあるようだし、調べたらなんかあるかも）


### Configure

qt5 ディレクトリと同じ階層に `qt5-build` ディレクトリを作成し、
そこでビルドを実行する。

よくある感じで `qt5/build` ディレクトリを作成し、
そこでビルドを実行しても大丈夫だとは思うけど、
ぼくは wiki に則った方法でやった。


僕の環境だと、この段階で以下のようなディレクトリ構成になってる。

```
C:\Users\mitsu\Documents\dev\qt\
├ qt5
├ qt5-build
└ qt5vars.bat
```

`-opensource` フラグを付けて configure を実行。

```cmd
cd ..
mkdir qt5-build
cd .\qt5-build\
..\qt5\configure.bat -developer-build -opensource -nomake examples -nomake tests
```

途中でライセンス周りの確認があるので、
問題がなければ `y` で続行する。


#### Standalone Qt Application
上記の手順だけだと、動的リンクを必要とする Qt Application しか作成できない。


もし、スタンドアロンで実行可能な Qt Application を作成したい場合は、
`-static` フラグも指定する必要がある。

参考: https://wiki.qt.io/Build_Standalone_Qt_Application_for_Windows#Using_Microsoft_Visual_Studio


ぼくは動的リンク版で configure ~ build してから暫くしてこれに気付いた。
そのため、まえの時とは違い Developer PowerShell for VC 2022 を使用して configure してる。

一応、ぼくが実行したコマンドをそのまま載せておくので、環境に応じて適宜変更してください。

```
mkdir qt5-build
cd .\qt5-build\
../qt5/configure -static -release -opensource -nomake examples -nomake tests -platform win32-msvc
```


### ビルド

続けて、ビルドを実行する。

`nmake` コマンドを実行するだけだけど、そのままやったら４時間くらい掛かった。

環境変数 `CL` に `/MP` を指定することで、`nmake` が内部で呼び出している
VC++ (cl.exe) が全てのコアを使って並列ビルドをしてくれるらしい。<br>
参考： https://stackoverflow.com/a/23618950

これを指定することで、ぼくの環境では１時間半くらいで済むようになった。

必要に応じて `set CL=/MP` を指定して実行してください。

```cmd
set CL=/MP
nmake
```

`-static` を指定した場合、約 7GiB 弱くらいストレージを喰うので注意。<br>
（指定しなかった場合もそれなりだった気がするけど覚えてない……）


### 出力結果

`qt5-build` ディレクトリの中にいろいろと生成されてる。

`qmake.exe` は２つあるけども、ぼくはよく分かってません。

- `qt5-build\qtbase\bin\qmake.exe`
- `qt5-build\qtbase\qmake\qmake.exe`

ファイルハッシュが違うので別物っぽいけど、何ですかね（謎）。

基本的には `qt5-build\qtbase\bin` ディレクトリにパスを通せば
qt アプリをビルドできるようになる。


#### 環境変数の設定

`qt5-build\qtbase\bin` ディレクトリにパスを通す。

```cmd
$env:Path +=';C:\Users\mitsu\Documents\dev\qt\qt5-build\qtbase\bin'
```

コマンドプロンプトなら以下のようにする。

```cmd
set PATH=%PATH%;C:\Users\mitsu\Documents\dev\qt\qt5-build\qtbase\bin
```

これで Qt5 を使用する準備ができたハズ。




## Qt プロジェクトのビルド

Qt プロジェクトのビルド周りのメモも残しておく。

ぼくが Windows 上での開発に慣れていないため、
かなり手探りの内容になっているので注意。<br>
というかほぼ書き捨てのメモなので、参考程度に……。


### 前提

Visual Studio Developer PowerShell 上で作業する。

これは PowerShell 用の `vcvarsall.bat` がなく、
そのままだと `nmake` が使えないため。<br>
Developer PowerShell は Visual Studio 2022 インストール時に一緒にインストールされてた。

コマンドプロンプトに慣れているなら、
コマンドプロンプト上で vcvarsall.bat を使う形でもいいかも。

また、`qt5-build\qtbase\bin` にパスが通っていることを確認しておく。


### Visual Studio 2022 の設定

Visual Studio 2022 上で Qt5 アプリの開発（というかビルド）をできるようにする設定。


<strong>※ 注意</strong>

2022/05/12 時点では、 Qt Visual Studio Tools に問題があるらしく、
`qmake.exe` をパスに追加できない。

Qt VS Tools と qmake.exe のバージョンに互換性がないらしい。<br>
参考： https://bugreports.qt.io/projects/QTVSADDINBUG/issues/QTVSADDINBUG-1003?filter=allopenissues


### Qt Visual Studio Tools のインストール

Qt Visual Studio Tools (Qt VS Tools) を Visual Studio 2022 にインストールしていく。

- インストール
    - 拡張機能 > 拡張機能の管理
    - `Qt` で検索すると出てくるのでインストールする
    - Visual Studio 2022 を再起動　
    - 「拡張機能 > Qt VS Tools」が追加される
- 設定
    - 拡張機能 > Qt VS Tools > Qt Versions
    - Versions にビルドした qmake.exe を追加
- 読み込み
    - 拡張機能 > Qt VS Tools > Open Qt Project File (.pro)...
    - でたぶん読み込めるハズ


