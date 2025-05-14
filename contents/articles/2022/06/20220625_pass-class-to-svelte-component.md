---
title: "SvelteComponent に class を渡す"
created: 2022-06-25T00:00:00.000Z
categories: ["tech", "svelte"]
tags: ["tech", "svelte"]
---

`$$props.class` を利用する。

- MyComponent.svelte

```svelte
<!-- MyComponent.svelte -->
<div class={$$props.class}>
  <p>Component contents</p>
</div>
```

- App.svelte

```svelte
<script>
  import MyComponent from "./MyComponent.svelte";
</script>

<MyComponent class="md-3" />
```


スタイルの影響範囲は SvelteComponent で閉じているため、

- グローバルスコープのクラス
- コンポーネント側で定義しているクラス

を指定しないと効果がないことに注意。

CSS Framework を使ってるときに便利！

