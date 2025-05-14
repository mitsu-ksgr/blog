<!----------------------------------------------------------------------------
  src/routes/categories/+page.svelte

  Category page
 !---------------------------------------------------------------------------->
<script lang="ts">
  import type { Category } from "$lib/types/category";
  import type { CategoriesResponse } from "$lib/types/api";

  import Folder from "./Folder.svelte";

  interface Props {
    data: CategoriesResponse;
  }

  let { data }: Props = $props();
  let cats = $derived(data.categories as Category[]);
</script>

<svelte:head>
  <title>Category | みつのーと</title>
  <meta name="description" content="Archives | みつのーと" />
</svelte:head>

<section>
  <h2>Category</h2>

  <!-- 雑記を後にしたいので reverse() -->
  {#each [...cats].reverse() as cat}
    <Folder name={cat.name} children={cat.children} articles={cat.articles} />
  {/each}
</section>

<style lang="scss">
</style>
