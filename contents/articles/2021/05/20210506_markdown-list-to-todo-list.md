---
title: "sed で Markdown のリストを Todo に変換する"
slug: 20210506T2127
created: 2021-05-06T21:27:39Z
categories: ["tech", "ShellScript"]
tags: ["tech", "ShellScript", "sed", "markdown"]
---

Markdown 記法で記述されたリストを、 sed を使って Github Markdown の
Todo リスト形式に変換する.


```markdown:list.md
## Job
### Tasks
- task-1
  - task - 1.1
  - task - 1.2
  - task - 1.3
    - task - 1.3.1
  - task - 1.4
- task - 2
  - task - 2.1
  - task - 2.2
    - task 2.2.1
    - task 2.22
```


### すべてを Todo にする

```sh
$ sed -E "s/^(\s*)-/\1- \[ \]/" list.md > todo.md
```

```markdown:todo.md
## Job
### Tasks
- [ ] task-1
  - [ ] task - 1.1
  - [ ] task - 1.2
  - [ ] task - 1.3
    - [ ] task - 1.3.1
  - [ ] task - 1.4
- [ ] task - 2
  - [ ] task - 2.1
  - [ ] task - 2.2
    - [ ] task 2.2.1
    - [ ] task 2.22
```

### 先頭要素だけ Todo にする

```sh
$ sed "s/^-/\- \[ \]/" list.md  > todo.md
```

```markdown:todo.md
## Job
### Tasks
- [ ] task-1
  - task - 1.1
  - task - 1.2
  - task - 1.3
    - task - 1.3.1
  - task - 1.4
- [ ] task - 2
  - task - 2.1
  - task - 2.2
    - task 2.2.1
    - task 2.22
```

---

手順書を markdown で用意しておいて、実際にその手順を実行する際に
github の issue などで進行度をチェックして管理する、という使い方をすると便利。

