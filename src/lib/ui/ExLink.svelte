<!----------------------------------------------------------------------------
  ExLink.svelte

  External link helper.
 !---------------------------------------------------------------------------->
<script lang="ts">
  import Icon from "$lib/ui/Icon.svelte";

  interface Props {
    link: string;
    noExIcon?: boolean;
    children?: import('svelte').Snippet;
  }

  let { link, noExIcon = false, children }: Props = $props();
</script>

<a
  href={link}
  target="_blank"
  rel="external noreferrer"
>
  {@render children?.()}

  {#if !noExIcon}
    <Icon name="exlink" />
  {/if}
</a>

<style lang="scss">
</style>
