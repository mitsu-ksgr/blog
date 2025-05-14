<!----------------------------------------------------------------------------
  routes/entry/[date]/[slug]/+page.svelte

  [date] ... 20211218
  [slug] ... title
 !---------------------------------------------------------------------------->
<script lang="ts">
  import { onMount } from 'svelte';

  // * highlight.js styles
  // - https://highlightjs.org/static/demo/
  // - https://github.com/highlightjs/highlight.js/tree/main/src/styles
  import hljs from 'highlight.js';
  import "highlight.js/styles/a11y-dark.css";

  import type { ArticleResponse } from "$lib/types/api";

  import Shr from "$lib/ui/Shr.svelte";
  import Icon from "$lib/ui/Icon.svelte";

  import Meta from "./Meta.svelte";
  import ToC from "./ToC.svelte";

  interface Props {
    data: ArticleResponse;
  }

  let { data }: Props = $props();
  const article = data.article;

  onMount(() => {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });
  });
</script>

<svelte:head>
  <title>{article.fm.title} | みつのーと</title>
  <meta name="description" content="{article.fm.title} | みつのーと" />
</svelte:head>

<section>
  <Meta meta={article.fm} />

  <Shr style="dashed" />

  {#if article.toc.length > 0}
    <div class="toc">
      <ToC toc={article.toc} />
    </div>
  {/if}

  <!-- main contents -->
  <div class="contents">
    {@html article.body}
  </div>

  <!-- contents footers -->
  <div class="after-content-line"></div>
  <Shr style="dashed" />
  <div class="footer">
    <div class="top">
      <button
        class="btn-no-style"
        onclick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <Icon name="upup" />
      </button>
    </div>
  </div>
</section>

<style lang="scss">
  .toc {
    margin-top: 1.5rem;
  }
  .contents {
    margin-top: 1.5rem;

    :global(pre) {
      max-width: 700px;
      white-space: pre;
      overflow-x: scroll;
    }
    :global(a) {
      word-break: break-all;
    }
    :global(img) {
      display: block;
      float: none;
      margin-left: auto;
      margin-right: auto;
    }
  }
  .after-content-line {
    margin-top: 2.5rem;
  }
  .footer {
    padding-top: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
  }
</style>
