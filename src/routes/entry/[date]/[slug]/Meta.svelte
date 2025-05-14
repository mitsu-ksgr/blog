<!-----------------------------------------------------------------------------
  Meta.svelte

  Display meta data of markdown.
 !----------------------------------------------------------------------------->
<script lang="ts">
  import { base } from "$app/paths";
  import Icon from "$lib/ui/Icon.svelte";

  let { meta } = $props();
  const create_date = meta.created ? meta.created.slice(0, 10) : "";
  const update_date = meta.updated ? meta.updated.slice(0, 10) : "";

  // 技術記事で、書いてから1年経ってるかどうか
  const is_old = (() => {
    if (!meta.categories.includes("tech")) return false;
    const ly = new Date();
    ly.setFullYear(ly.getFullYear() - 1);
    return new Date(meta.created) <= ly;
  })();
</script>

<section>
  <div class="category">
    <Icon name="folder" />
    <a href="{base}/categories">
      {#each meta.categories as cat, i}
        {#if i !== 0}
          &nbsp; &gt;
        {/if}
        {cat}
      {/each}
    </a>
  </div>

  <div class="date">
    <div class="wrap">
      <span class="th">Date</span>
      <span class="td">{create_date}</span>
    </div>
    {#if update_date}
      <div class="wrap">
        <span class="th">Update</span>
        <span class="td">{update_date}</span>
      </div>
    {/if}
  </div>

  <div class="title">
    <h2>{meta.title}</h2>
    {#if is_old}
      <p class="old">※ この記事を書いてから1年以上経ってるかも</p>
    {/if}
  </div>

  <div class="tags">
    <Icon name="tag" />
    &nbsp;
    {#each meta.tags as tag, i}
      {#if i !== 0}
        &nbsp;,&nbsp;
      {/if}
      <a href="{base}/tags?tag={tag}">{tag}</a>
    {/each}
  </div>
</section>

<style lang="scss">
  section {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(3, auto);
    grid-column-gap: 0px;
    grid-row-gap: 0px;

    padding-bottom: 0.5rem;
    margin-bottom: 0.5rem;

    .category {
      grid-area: 1 / 1 / 2 / 4;
    }
    .date {
      grid-area: 1 / 4 / 2 / 6;
      .wrap {
        text-align: right;
        .th {
          padding-right: 0.5rem;
        }
      }
    }
    .title {
      grid-area: 2 / 1 / 3 / 6;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
      h2 {
        margin-bottom: 0;
      }
      .old {
        color: tomato;
      }
    }
    .tags {
      grid-area: 3 / 1 / 4 / 6;
      text-align: right;
    }
  }
</style>
