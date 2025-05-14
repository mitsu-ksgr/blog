---
title: "Hugo on Docker: コンテンツを別管理するときのバインドについてのメモ"
created: 2024-10-22T23:21:41.151Z
categories: ["tech", "Hugo"]
tags: ["tech", "Hugo", "Docker"]
---

タイトルが意味不明すぎる、タイトルを付けるの難しい……。


### 前提

- Docker 上で Hugo を動かす（ローカル環境でのテスト的なアレ）
- Hugo image は [ghcr.io/gohugoio/hugo](https://github.com/gohugoio/hugo/pkgs/container/hugo) ベースにしたものを想定
- Markdown で書かれたコンテンツは Hugo プロジェクトとは別で管理している
    - content ディレクトリ配下の markdown ファイル群だけ別で管理してる構成

Markdown ファイルで構成されたディレクトリを、
Hugo コンテナにバインドして、
Hugo 上でプレビューする、みたいな感じ


### 普通は
そのまま -v でバインドすれば良くて、特に意識する必要はない。
なんの問題もない。

```sh
$ docker run --rm -it -p 1313:1313 -v ./docs:/project/app/content/docs my-hugo:latest
```

※ ドキュメントまわりでアレコレしてたときに出た話題だから `docs` という名前のディレクトリを例にしてる


### 本題

何の問題もないんだけど、
毎回 `-v ./docs:/project/app/content/docs` したくないと思ってしまった。

`-v ./pages:/pages` みたいにしたい。

これが意外と面倒だったので、いろいろ試したときの記録。


#### 1. シンボリックリンク

`docker-entrypoint.sh` を用意して、起動時に `/docs` と `/project/app/content/docs` を繋げる作戦。

```sh
# docker-entrypoint.sh

ln -s /docs /project/app/content/docs

hugo server -D --bind 0.0.0.0
```

```sh
$ docker run --rm -it -p 1313:1313 -v ./docs:/docs my-hugo:latest
```

これでもプレビューはできるが、リアルタイムの更新が上手く動作しない。

ドキュメントを更新したらコンテナを再起動しないと更新が反映されなかった。

Hugo はファイル変更の検出に `inotify` を使っていて、
`inotify` はシンボリックリンク先を監視しないらしい。



#### 2. mount する

なら mount すればいけるか、ということで `docker-entrypoint.sh` の `ln -s` を `mount --bind` にしてみた。

```sh
# docker-entrypoint.sh

mount --bind /docs /project/app/content/docs

hugo server -D --bind 0.0.0.0
```

これで docker run をすると、以下のエラーが出力される。

```
mount: permission denied (are you root?)
```

`USER root` をしていても同じエラーになる。
どうもディレクトリ同士のマウントだとしても、`mount` コマンドを実行するには特権コンテナにする必要があるらしい。

`docker run` 時に `--privileged` オプションを追加したところ、望む動作をしてくれた。

でもこれだけのために特権コンテナなんて使いたくないし、
毎回 `--privileged` を入力するのは面倒くさい。

`-v ./docs:/docs --privileged` と `-v ./docs:/project/app/content/docs`
だとあんまりタイプ数に違いもないし……。


一応 privileged かどうかをチェックするスクリプトも書いてたので、
ここで供養しておく 🙏

```sh
# docker-compose.yml
check_privileged() {
    local test_dir=$(mktemp -d)
    if mount --bind "${test_dir}" "${test_dir}" &>/dev/null; then
        # OK!
        umount "${test_dir}"
        rmdir "${test_dir}"
    else
        cat <<__EOS__ 1>&2
Error: Please run the container with the '--privileged' otion.

$ docker run --rm -it --privileged -p 1313:1313 -v ./your-docs:/docs hextra-dock:latest
__EOS__
        exit 1
    fi
}

main() {
    check_privileged

    mount --bind /docs /project/app/content/docs

    # 実際は、他の例の場合も 'USER root' のときは runuser で hugo を起動してる
    runuser -u hugo -- \
        hugo server -D --bind 0.0.0.0
}

main $@
exit 0
```



#### 3. rsync し続ける

最終的にたどり着いたのが `rsync` する方法。
Chat-GPT さんに「なんかいい方法ない？」って聞いてたら教えてくれた、
AI万歳、ぼくなど必要なかった。

```sh
# docker-entrypoint.sh

# 初回同期
rsync -av --delete /docs/ /project/app/content/docs/

# バックグランドで定期的に同期
while true; do
    rsync -av --delete /docs/ /project/app/content/docs/
    sleep 5 # そうしたければ１秒でもいい
done &

hugo server -D --bind 0.0.0.0
```

すこしギョッとするけど、うまく動く。

これで晴れて

```sh
$ docker run --rm -it -p 1313:1313 -v ./docs:/docs my-hugo:latest
```

でコンテナを開始し、ファイルの変更もリアルタ……5秒おきに反映できるようになった。


##### おわり
最初にやりたかった、

- `-v ./docs:/docs` でバインドしたい
- リアルタイムで変更を反映したい

が達成できたから満足ではあるけど、思ったより大げさな感じになってしまった。

普通に我慢してバインドしたほうが良さそう。

あと LLM 便利、いつもありがとう。


