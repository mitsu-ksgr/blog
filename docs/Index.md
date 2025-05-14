# Docs

### Routes
- `/` ... トップページ
- `/api` ... (プリレンダリング前提の) API
- `/archives/` ... 記事リスト
- `/categories/` ... カテゴリ毎に記事を分類・リストしたページ
- `/tags/` ... タグ毎に記事を分類・リストしたページ
- `/feed/` ... RSS 配信
- `/entry/[date]/[slug]/` ... 記事ページ


## 仕様
### Contents
- 記事は `./contents/articles/{year}/{month}/` 以下に配置
- 画像などは `./static/images` あたりに配置してマークダウンから参照

#### Article
- 記事は Markdown ファイルとして記述する
- 記事のファイル名は以下のフォーマットに従う
  - `{date}_{slug}.md`
    - `date` ... `YYYYMMDD` 形式. `20221218` のような形.
    - `slug` ... `[a-zA-Z0-9\-]` 形式. `hello-world` のような形.
    - `20221218_hello-world.md` といったファイル名になる
- markdown には [YAML FrontMatter](http://jekyllrb-ja.github.io/docs/front-matter/) を含めること
  - `title` ... 記事タイトル
  - `created` ... 記事作成日
  - `categories` ... カテゴリ. Array.
  - `tags` ... タグ. Array.
  - Optional
    - `updated` ... 最新更新日.
    - `draft` ... 下書きかどうか (TODO).

`new-post` コマンドから記事を作成できる.

```sh
$ docker-compose run --rm app yarn new-post 'hello world'

# 日付指定
$ docker-compose run --rm app yarn new-post 'hello world' 2099-12-18
```


### Catalog files (Auto generate files)
各記事情報を纏めたファイル.
以下のファイルは `src/lib/task/cataloger.js` を使用して生成する.

- `contents/articles.json` ... `contents/articles` 以下の記事ファイルのインデックス
- `contents/categories.json` ... 各記事をカテゴリ毎に分類したもの
- `contents/tags.json` ... 各記事をタグ毎に分類したもの
- `contents/article_routes.json` ... 各記事のパス情報

```sh
$ docker-compose run --rm app yarn make-catalogs
```

記事を追加・更新したらカタログファイルを更新する.


