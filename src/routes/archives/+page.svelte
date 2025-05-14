<!----------------------------------------------------------------------------
  src/routes/archive/+page.svelte

  Archive page
 !---------------------------------------------------------------------------->
<script lang="ts">
  import type { ArticleIndex } from "$lib/types/article";
  import type { EntriesResponse } from "$lib/types/api";

  interface Props {
    data: EntriesResponse;
  }

  let { data }: Props = $props();

  const years = data.entries.reduce(
    (ret, entry) => {
      const y = entry.file_date.slice(0, 4); // get year string
      if (!(y in ret)) ret[y] = [];
      ret[y]!.push(entry);
      return ret;
    },
    {} as Record<string, ArticleIndex[]>,
  );
</script>

<svelte:head>
  <title>Archives | みつのーと</title>
  <meta name="description" content="Archives | みつのーと" />
</svelte:head>

<section>
  <h2>Archives</h2>

  <div class="archives">
    {#each Object.keys(years).reverse() as year}
      <details open>
        <summary>{year}</summary>
        <ul>
          {#each years[year]!.reverse() as entry}
            <li>
              <a href={entry.link}>
                {entry.created.slice(0, 10)} ... {entry.title}
              </a>
            </li>
          {/each}
        </ul>
      </details>
    {/each}
  </div>
</section>

<style lang="scss">
  .archives {
    details {
      summary {
        font-weight: bold;
      }
    }
  }
</style>
