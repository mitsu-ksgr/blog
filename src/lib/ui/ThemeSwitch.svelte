<!----------------------------------------------------------------------------
  ThemeSwitch.svelte

  Theme switch
 !---------------------------------------------------------------------------->
<script lang="ts">
  import { Themes, theme } from "$lib/theme";
  import Icon from "$lib/ui/Icon.svelte";
</script>

<button class="btn-no-style" onclick={() => theme.switch()}>
  {#if $theme === Themes.Dark}
    <span data-tooltip="Turn off dark mode" data-placement="left">
      <Icon name="sun" />
    </span>
  {:else}
    <span data-tooltip="Turn on dark mode" data-placement="left">
      <Icon name="moon" />
    </span>
  {/if}
</button>

<style lang="scss">
</style>
