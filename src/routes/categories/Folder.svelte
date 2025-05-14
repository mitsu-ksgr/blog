<!----------------------------------------------------------------------------
  src/routes/categories/Folter.svelte

  Folder component.
 !---------------------------------------------------------------------------->
<script lang="ts">
  import Folder from './Folder.svelte';
  import Icon from "$lib/ui/Icon.svelte";

  import type { ArticleIndex } from "$lib/types/article";
  import type { Category } from "$lib/types/category";

  interface Props {
    name: string;
    children?: Array<Category>;
    articles?: Array<ArticleIndex>;
  }

  let { name, children = [], articles = [] }: Props = $props();
  let is_open = $state(true);
  let icon_key = $derived(is_open ? "folder" : "folder_plus");

  function toggleOpen() {
    is_open = !is_open;
  }
</script>

<div>
  <button class="folder" onclick={toggleOpen}>
    <Icon name={icon_key} />
    <span class="tag-name">{name}</span>
  </button>

  {#if is_open}
    <div class="children">
      {#each children as cat}
        <Folder
          name={cat.name}
          children={cat.children}
          articles={cat.articles}
        />
      {/each}

      {#each articles.reverse() as article}
        <div class="child">
          ・<a href={article.link}>
            {article.created.slice(0, 10)} ... {article.title}
          </a>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style lang="scss">
  .folder {
    /* reset button style */
    padding: 0;
    border: none;

    /* style */
    display: inline-block;
    color: inherit;
    background-color: inherit;
    text-align: left;
    margin-bottom: 0.25rem;

    .tag-name {
      padding-left: 0.25rem;
    }
  }

  .children {
    margin-top: 0.1rem;
    margin-bottom: 0.2rem;
    padding-left: 1.25rem;

    .child {
      margin-bottom: 0.2rem;
    }
  }
</style>
