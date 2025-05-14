---
title: "ShellScript: 部分抽出記法まとめ"
created: 2021-06-05T00:00:00.000Z
categories: ["tech", "ShellScript"]
tags: ["tech", "ShellScript"]
---

シェルスクリプトで使用できる部分抽出記法 (Parameter Expansion) のまとめ。

参考： https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html#tag_18_06_02


### 早見表

| 記法             | 説明                                     |
|:-----------------|:-----------------------------------------|
| `${#param}`      | 現在のロケールにおける文字列の長さ       |
| `${param%word}`  | 最小マッチした接尾辞パターンを削除       |
| `${param%%word}` | 最大マッチした接尾辞パターンを削除       |
| `${param#word}`  | 最小マッチした接頭辞パターンを削除       |
| `${param##word}` | 最大マッチした接頭辞パターンを削除       |

| $param が…       | 値を持つ  | Null (空文字列) | 未定義       |
|:-----------------|:----------|:----------------|:-------------|
| `${param:-word}` | $param    | "word"          | "word"       |
| `${param-word}`  | $param    | ""              | "word"       |
| `${param:=word}` | $param    | "word", 代入    | "word", 代入 |
| `${param=word}`  | $param    | ""              | "word", 代入 |
| `${param:?word}` | $param    | Error, exit     | Error, exit  |
| `${param?word}`  | $param    | ""              | Error, exit  |
| `${param:+word}` | "word"    | ""              | ""           |
| `${param+word}`  | "word"    | "word"          | ""           |

<br>

- 状態
  - 値を持つ ... 変数 `$param` が定義され、値が代入されている状態
    - `a=123` や `a=hoge`, `a="hoge"` した状態
  - Null (空文字列) ... 変数 `$param` は定義されているが、値が設定されていない状態
    - 空文字列が設定されている状態も含む
    - `a=` や `a=""`, 関数内で `local a`, `local a=` した状態
  - 未定義 ... 変数 `$param` は定義されていない状態
    - `set -u` としてる場合にそのまま使うとエラーになる状態
- 表中の用語
  - $param ... 変数 `$param` の値が読み出される
  - "word" ... 文字列 `word` が読み出される
  - "" ... 空文字列が読み出される
  - "word", 代入 ... 文字列 `word` を読み出し、`$param` に `word` を代入する
  - Error, exit ... 戻り値 `$?` が非ゼロの値になる


### 具体例

#### 変数読み出しと文字列長

<details>
<summary>${param}</summary>
<div>

```sh
a=123
b=    # b="" でも同じ

echo "A=$a"
echo "B=$b"
echo "C=$c"
```

上記スクリプトを `sample.sh` として保存し、実行した結果は以下のとおり。
<br>
（他の例でも同様のファイル名で保存・実行した結果を載せてます）

```sh
$ /bin/bash sample.sh
A=123
B=
C=

$ /bin/bash -eu sample.sh
A=123
B=
sample.sh: line 6: c: unbound variable
```

</div>
</details>


<details>
<summary>${#param}</summary>
<div>

- `$param` の文字列の長さを読み出す
- `$param` が `*` または `@` の場合、展開結果は不定
- `$param` が未定義で、かつ `-u` が有効な場合、展開は失敗する

```sample.sh
a=abc
b=あいうえお
c=

echo "A(${#a}) ... ${a}"
echo "B(${#b}) ... ${b}"
echo "C(${#c}) ... ${c}"
echo "D(${#d}) ... ${d}"
```

```sh
$ /bin/bash sample.sh
A(3) ... abc
B(5) ... あいうえお
C(0) ...
D(0) ...

$ /bin/bash -eu sample.sh
A(3) ... abc
B(5) ... あいうえお
C(0) ...
sample.sh: line 8: d: unbound variable
```

</div>
</details>


#### パターンの削除

<details>
<summary>${param%[word]}</summary>
<div>

- `$param` に格納された文字列から、最小マッチした接尾辞パターン `[word]` を削除した文字列を生成する
- `[word]` 部を展開したパターンでマッチを行う
- `[word]` は、引用符で囲まれてない `%` から始まってはいけない

```sample.sh
f1=sample.log
f2=sample.log.zip
f3=/var/log/sample.log

echo "${f1} --> ${f1%.*}"
echo "${f2} --> ${f2%.*}"
echo "${f3} --> ${f3%/*}"
```

```sh
$ /bin/bash sample.sh
sample.log --> sample
sample.log.zip --> sample.log
/var/log/sample.log --> /var/log
```

</div>
</details>


<details>
<summary>${param%%[word]}</summary>
<div>

- `$param` に格納された文字列から、最大マッチした接尾辞パターン `[word]` を削除した文字列を生成する
- `[word]` 部を展開したパターンでマッチを行う
- `[word]` は、引用符で囲まれてない `%` から始まってはいけない

```sample.sh
f1=sample.log
f2=sample.log.zip

echo "${f1} --> ${f1%%.*}"
echo "${f2} --> ${f2%%.*}"
```

```sh
$ /bin/bash sample.sh
sample.log --> sample
sample.log.zip --> sample
```

</div>
</details>


<details>
<summary>${param#[word]}</summary>
<div>

- `$param` に格納された文字列から、最小マッチした接頭辞パターン `[word]` を削除した文字列を生成する
- `[word]` 部を展開したパターンでマッチを行う
- `[word]` は、引用符で囲まれてない `#` から始まってはいけない

```sample.sh
f1=sample.log
f2=sample.log.zip

echo "${f1} --> ${f1#*.}"
echo "${f2} --> ${f2#*.}"
```

```sh
$ /bin/bash sample.sh
sample.log --> log
sample.log.zip --> log.zip
```

</div>
</details>


<details>
<summary>${param##[word]}</summary>
<div>

- `$param` に格納された文字列から、最大マッチした接頭辞パターン `[word]` を削除した文字列を生成する
- `[word]` 部を展開したパターンでマッチを行う
- `[word]` は、引用符で囲まれてない `#` から始まってはいけない

```sample.sh
f1=sample.log
f2=sample.log.zip
f3=/var/log/sample.log

echo "${f1} --> ${f1##*.}"
echo "${f2} --> ${f2##*.}"
echo "${f3} --> ${f3##*/}"
```

```sh
$ /bin/bash sample.sh
sample.log --> log
sample.log.zip --> zip
/var/log/sample.log --> sample.log
```

</div>
</details>


#### デフォルト値の使用

<details>
<summary>${param:-[value]}</summary>
<div>

- デフォルト値を使用する
- `$param` に値が設定されている場合、その値が読み出される
- `$param` が未定義または Null (空文字列) の場合、`[value]` 部に指定したデフォルト値が読み出される
  - `[value]` 部が省略された場合、空文字列が読み出される

```sample.sh
a=123
b=

echo "A=${a:-word}"
echo "B=${b:-word}"
echo "C=${c:-word}"
```

```sh
$ /bin/bash sample.sh
A=123
B=word
C=word

$ /bin/bash -eu sample.sh
A=123
B=word
C=word
```

</div>
</details>


<details>
<summary>${param-[value]}</summary>
<div>

- デフォルト値を使用する
- `$param` に値が設定されている場合、その値が読み出される
- `$param` が Null (空文字列) の場合、空文字列が読み出される
- `$param` が未定義の場合、`[value]` 部に指定したデフォルト値が読み出される
  - `[word]` 部が省略された場合、空文字列が読み出される

```sample.sh
a=123
b=

echo "A=${a-word}"
echo "B=${b-word}"
echo "C=${c-word}"
```

```sh
$ /bin/bash sample.sh
A=123
B=
C=word

$ /bin/bash -eu sample.sh
A=123
B=
C=word
```

</div>
</details>


#### デフォルト値の代入

<details>
<summary>${param:=[value]}</summary>
<div>

- デフォルト値を代入する
- `$param` に値が設定されている場合、その値が読み出される
- `$param` が未定義または Null (空文字列) の場合、
  - `$param` に `[value]` 部に指定したデフォルト値を代入する
    - `$param` が未定義の場合、定義される
  - `[value]` 部が省略された場合、デフォルト値の代わりに空文字列が使用される
- この方法で代入できるのは変数に対してのみ
  - 位置パラメータや特殊パラメータには代入できない

```sample.sh
a=123
b=

echo "A=${a:=word}"
echo "B=${b:=word}"
echo "C=${c:=word}"
echo "-----"
echo "A=${a}"
echo "B=${b}"
echo "C=${c}"
```

```sh
$ /bin/bash sample.sh
A=123
B=word
C=word
-----
A=123
B=word
C=word

$ /bin/bash -eu sample.sh
A=123
B=word
C=word
-----
A=123
B=word
C=word
```

</div>
</details>


<details>
<summary>${param=[value]}</summary>
<div>

- デフォルト値を代入する
- `$param` に値が設定されている場合、その値が読み出される
- `$param` が Null (空文字列) の場合、空文字列が読み出される
- `$param` が未定義の場合、
  - `$param` を定義し、 `[value]` 部に指定したデフォルト値を代入する
  - `[value]` 部が省略された場合、空文字列が読み出される
- この方法で代入できるのは変数に対してのみ
  - 位置パラメータや特殊パラメータには代入できない

```sample.sh
a=123
b=

echo "A=${a=word}"
echo "B=${b=word}"
echo "C=${c=word}"
echo "-----"
echo "A=${a}"
echo "B=${b}"
echo "C=${c}"
```

```sh
$ /bin/bash sample.sh
A=123
B=
C=word
-----
A=123
B=
C=word

$ /bin/bash -eu sample.sh
A=123
B=
C=word
-----
A=123
B=
C=word
```

</div>
</details>


#### エラーの表示

<details>
<summary>${param:?[value]}</summary>
<div>

- 未定義または Null (空文字列) の場合、エラーを表示する
- `$param` に値が設定されている場合、その値が読み出される
- `$param` が未定義または Null (空文字列) の場合、 `[value]` を展開した値を標準エラーに書き出し、 0 以外の終了ステータスでシェルを終了する
  - `[value]` 部が省略された場合は、未設定であることを示すメッセージが書き出される

```sample.sh
a=123
b=

echo "A=${a:?word}"
echo "B=${b:?word}"
echo "C=${c:?word}"
```

```sh
$ /bin/bash sample.sh
A=123
sample.sh: line 5: b: word

$ /bin/bash -eu sample.sh
A=123
sample.sh: line 5: b: word
```

</div>
</details>


<details>
<summary>${param?[value]}</summary>
<div>

- 未定義の場合、エラーを表示する
- `$param` に値が設定されている場合、その値が読み出される
- `$param` が Null (空文字列) の場合、空文字列が読み出される
- `$param` が未定義の場合、 `[value]` を展開した値を標準エラーに書き出し、 0 以外の終了ステータスでシェルを終了する
  - `[value]` 部が省略された場合は、未設定であることを示すメッセージが書き出される

```sample.sh
a=123
b=

echo "A=${a?word}"
echo "B=${b?word}"
echo "C=${c?word}"
```

```sh
$ /bin/bash sample.sh
A=123
B=
sample.sh: line 6: c: word

$ /bin/bash -eu sample.sh
A=123
B=
sample.sh: line 6: c: word
```

</div>
</details>


#### 代替値の使用

<details>
<summary>${param:+[value]}</summary>
<div>

- 代替値を使用する
- `$param` に値が設定されている場合、`[value]` 部に指定した値を読み出す
  - `[value]` 部が省略された場合、空文字列が使用される
- `$param` が未定義または Null (空文字列) の場合、Null (空文字列) を代入する

```sample.sh
a=123
b=

echo "A=${a:+word}"
echo "B=${b:+word}"
echo "C=${c:+word}"
echo "------"
echo "A=${a}"
echo "B=${b}"
echo "C=${c}"
```

```sh
$ /bin/bash sample.sh
A=word
B=
C=
------
A=123
B=
C=

$ /bin/bash -eu sample.sh
A=word
B=
C=
------
A=123
B=
sample.sh: line 10: c: unbound variable
```

</div>
</details>


<details>
<summary>${param+[value]}</summary>
<div>

- 代替値を使用する
- `$param` に値が設定されているか Null (空文字列) の場合、`[value]` 部に指定した値を読み出す
  - `[value]` 部が省略された場合、空文字列が使用される
- `$param` が未定義の場合、Null (空文字列) を代入する

```sample.sh
a=123
b=

echo "A=${a+word}"
echo "B=${b+word}"
echo "C=${c+word}"
echo "------"
echo "A=${a}"
echo "B=${b}"
echo "C=${c}"
```

```sh
$ /bin/bash sample.sh
A=word
B=word
C=
------
A=123
B=
C=

$ /bin/bash -eu sample.sh
A=word
B=word
C=
------
A=123
B=
sample.sh: line 10: c: unbound variable
```

</div>
</details>


