<!-----------------------------------------------------------------------------
  ToC.svelte

  Table of contens
 !----------------------------------------------------------------------------->
<script lang="ts">
  import type { Headline } from "$lib/types/article";

  interface Props {
    toc?: Headline[];
  }

  let { toc = [] }: Props = $props();
  const offset = toc.reduce(
    (min, c) => {
      return min > c.depth ? c.depth : min;
    },
    toc.length == 0 ? 0 : toc[0]!.depth,
  );
</script>

<section>
  <div class="toc">
    <details open>
      <summary>もくじ</summary>

      <ul>
        {#each toc as c}
          <li style="margin-left: {c.depth - offset}rem;">
            <a href={c.anchor}>{c.title}</a>
          </li>
        {/each}
      </ul>
    </details>
  </div>
</section>

<style lang="scss">
</style>
