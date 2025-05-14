<!----------------------------------------------------------------------------
  src/routes/tags/+page.svelte

  Tag page
 !---------------------------------------------------------------------------->
<script lang="ts">
  import { onMount } from "svelte";
  import Icon from "$lib/ui/Icon.svelte";

  import type { TagsResponse } from "$lib/types/api";
  import type { ArticleIndex } from "$lib/types/article";
  import type { Tag, TagList } from "$lib/types/tag";

  interface Props {
    data: TagsResponse;
  }

  let { data }: Props = $props();
  const taglist: TagList = data.taglist;
  const tags: Tag[] = data.taglist.tags;
  const articles: ArticleIndex[] = data.taglist.articles;

  console.log(data);

  let selected: string | null | undefined = $state();
  let cur_tag = $derived(taglist.tags.find(item => item.name === selected));

  onMount(async () => {
    const url = new URL(window.location.href);
    selected = url.searchParams.get("tag");
  });
</script>

<svelte:head>
  <title>Tags | みつのーと</title>
  <meta name="description" content="Archives | みつのーと" />
</svelte:head>

<section>
  <h2>Tags</h2>

  <div class="tags">
    {#each tags as tag}
      <a
        href="?tag={encodeURI(tag.name)}"
        class="tag"
        onclick={() => (selected = tag.name)}
      >
        <Icon name="tag" />
        <span class="text">{tag.name} ({tag.indexes.length})</span>
      </a>
    {/each}
  </div>

  {#if cur_tag}
    <article>
      <header>
        <Icon name="tag" />
        <span style="font-weight: bold;">{selected}</span>
      </header>

      <ul>
        {#each cur_tag.indexes.reverse() as idx}
          {@const article = articles[idx]}
          {#if article}
            <li>
              <a href={article.link}>
                {article.created.slice(0, 10)} ... {article.title}
              </a>
            </li>
          {/if}
        {/each}
      </ul>
    </article>
  {/if}
</section>

<style lang="scss">
  .tags {
    display: flex;
    flex-wrap: wrap;

    a {
      padding-right: 1.5rem;
    }
  }
</style>
