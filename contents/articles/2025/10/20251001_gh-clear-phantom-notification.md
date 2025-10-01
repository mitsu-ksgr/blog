---
title: "Github - ゴースト通知を既読にする方法"
created: 2025-10-01T00:01:56.532Z
categories: ["tech"]
tags: ["tech", "GitHub"]
---

Github でスパム垢からメンション？が来たっぽいけど、
すでに通知元のコンテンツが削除されているせいか、
通知だけが残り続けてしまう問題に遭遇……。

ずっと通知１件と表示されてて消せない状態に。

Web ページからは消せなかったからサポートに連絡したところ、
通知の消し方を教えてもらったのでメモ。

ちなみに英語では Phantom notification というらしい。


### GitHub のゴースト通知
- スパムアカウントからメンションが来る
- 通知が作成
- こちらがその通知を確認する前に、
  そのアカウントが利用規約違反とフラグ付けされる
  - この場合、スパム垢のコンテンツは（他ユーザーの保護のため）非表示になるらしい
- 通知元のコンテンツが確認できない通知だけが残る
- 通知元を確認できないから通知を消せない ⚠️

という流れでゴースト通知が発生する。

現在はこういった通知そのものを削除することはできないらしい。

ただ、 API 経由で既読にすることはできるので、
結果として通知が残り続ける問題は回避できるとのこと。


### ゴースト通知を既読にする
Notification API を直接叩くことで既読にできる。
以下の方法は全ての通知を既読にするので注意。

#### gh コマンドを使う
```
$ gh auth login
$ gh api --method PUT -H "Accept: application/vnd.github+json" /notifications -F read=true
```

#### curl で叩く
PAT (Personal Access Token) を使えば、 curl で API を叩いて通知を既読にできる。

PAT は `notifications` スコープが必要。

```
$ curl -X PUT -H "Accept: application/vnd.github.v3+json" -H "Authorization: token $TOKEN" https://api.github.com/notifications
```

- [Managing your personal access tokens \- GitHub Docs](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-token)
- [REST API endpoints for activity \- GitHub Docs](https://docs.github.com/en/rest/activity?apiVersion=2022-11-28#mark-notifications-as-read)


### おわり
サポートチケットを作成してから12時間程度で返答が来た、感謝っ🙏

なお「この問題は複雑なため、バグ修正の時期を約束することはできません」とのこと。


