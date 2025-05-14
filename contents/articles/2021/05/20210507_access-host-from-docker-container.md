---
title: "Dockerコンテナ内からホストへアクセスする"
slug: 20210507T2055
created: 2021-05-07T20:55:01Z
updated: 2021-07-30T01:23:34Z
categories: ["tech", "docker"]
tags: ["tech", "docker", "docker-compose"]
---


以下は、 `--link` オプションが追加される前のメモ。
一応残しておく。

---

Docker コンテナ内部から、ホストマシンへアクセスする方法のメモ。

たとえば、

- web サービス A, B を、それぞれ別の docker-compose を使って環境構築してる
- で、ローカルで開発をしていて、
- サービス B 側のコンテナから、サービス A にアクセスしたい……

みたいなときに便利。


### やりかた

linux ベースのイメージであれば、コンテナのデフォルトゲートウェイを調べて、
そこに対してアクセスすればいいっぽい。

デフォルトゲートウェイを調べるには、コンテナ内で以下のようにする。

```bash
$ ip route show
default via 172.17.0.1 dev eth0
172.17.0.0/16 dev eth0 scope link  src 172.17.0.4
```

1行目の `172.17.0.1` がデフォルトゲートウェイの IP アドレスになる。

ip コマンドが使えない場合、`net-tools` パッケージの `netstat` コマンドが使える。

```bash
$ netstat -nr
Kernel IP routing table
Destination     Gateway         Genmask         Flags   MSS Window  irtt Iface
0.0.0.0         172.17.0.1      0.0.0.0         UG        0 0          0 eth0
172.17.0.0      0.0.0.0         255.255.0.0     U         0 0          0 eth0
```

この場合、 `Destination` が `0.0.0.0` の行の `Gateway` のアドレスを確認する。

何度もアクセスを行う場合は `/etc/hosts` を更新しておくと便利。

```sh
$ ip route show | awk '/default/ {print $3" dockerhost"}' >> /etc/hosts
$ netstat -nr | awk '/^0.0.0.0/ {print $2" dockerhost"}' >> /etc/hosts

# dockerhost でホストにアクセスできる
$ curl http://dockerhost:8080
```


### 試してみる

例として、ホスト上で 8080 ポートを listen してる web サーバを立ち上げて、
docker コンテナ上からそこにアクセスしてみる。

```sh
# ホスト側で、適当に web サーバを立ち上げておく
% python -m SimpleHTTPServer 8080
Serving HTTP on 0.0.0.0 port 8080 ...

# python がなければ netcat コマンドでもなんでもいい
% nc -l -p 8080 -c 'echo "HTTP/1.1 200 OK"; echo -e "\n\nhello netcat!"'
```


#### インタラクティブシェルで試す

```sh
% docker run --rm -it alpine:latest /bin/sh
# デフォルトゲートウェイの IP を調べる
$ ip route show
default via 172.17.0.1 dev eth0
172.17.0.0/16 dev eth0 scope link  src 172.17.0.4

# curl コマンドを入れてアクセスする
$ apk add curl
$ curl http://172.17.0.1:8080
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 3.2 Final//EN"><html>
~~ 略 ~~
</html>
```

※ 分かりやすさのため、ホストのプロンプトは `%`、 docker コンテナ内のプロンプトは `$` にして記載


##### --add-host オプション

ちなみに、`--add-host` オプションを使用して、起動時にホストを指定することもできる。

```sh
% docker run --rm --add-host=dockerhost:$(ip route show | awk '/docker0/ {print $9}') -it alpine
$ apk add curl
$ curl http://172.17.0.1:8080
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 3.2 Final//EN"><html>
~~ 略 ~~
</html>
```

これは Linux 環境での例なので、OSX とかを使ってる人は動かないかも……。
`$(ip route ~~~ )` 部分はその環境に合った方法でアレコレしましょう。


#### Dockerfile で試す

Dockerfile の `RUN` で `/etc/hosts` にホストの IP を追記できれば嬉しいけれど、
ホストの IP はコンテナを実際に立ち上げるまで決定できないため、 Dockerfile 編集時点では定義できない。

とはいえ毎回コンテナに入る度に手動で `/etc/hosts` を更新したくないので、
`ENTRYPOINT` で対応する。

```Dockerfile
FROM alpine:latest

WORKDIR /root

RUN apk add --no-cache curl

COPY ./docker-entrypoint.sh /
ENTRYPOINT ["/docker-entrypoint.sh"]

CMD ["/bin/sh"]
```

```docker-entrypoint.sh
#!/usr/bin/env sh
set -e

# ip route を使用して docker host の IP を dockerhost として /etc/hosts に設定
ip route show |\
    awk '/default/ {print $3" dockerhost"}' \
        >> /etc/hosts

# netstat を使用して docker host の IP を dockerhost として /etc/hosts に設定
#netstat -nr |\
#    awk '/^0.0.0.0/ {print $2" dockerhost"}' \
#    >> /etc/hosts

exec "$@"
```

という形で `Dockerfile` と `docker-entrypoint.sh` を用意する。

```sh
% ls
docker-entrypoint.sh  Dockerfile

% docker build -t access-test:latest .
% docker run --rm -it access-test:latest
$ curl http://dockerhost:8122
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 3.2 Final//EN"><html>
~~ 略 ~~
</html>
```

今回は alpine で試したけど、debian ベースのイメージでも同じ方法でやれると思う。
（だいたいの言語のデフォルトイメージは debian ベースな気がする、たぶん。知らんけど。）

ただし、
「`ENTRYPOINT` を指定すると、ベースイメージの `ENTRYPOINT` を上書きしてしまう」
という点に注意。

ベースイメージ側で `ENTRYPOINT` で何らかの前処理をしている場合は、
それに沿った挙動をするよう `docker-entrypoint.sh` を調整する。

