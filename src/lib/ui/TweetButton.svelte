<!----------------------------------------------------------------------------
  TweetButton.svelte

  Tweet button with bird icon.
 !---------------------------------------------------------------------------->
<script lang="ts">
  import Icon from "$lib/ui/Icon.svelte";

  function handleClick() {
    const link = encodeURI(
      [
        "http://twitter.com/share",
        `?url=${window.location.href}`,
        `&text=${document.title}`,
      ].join(""),
    );
    window.open(link, "_blank")?.focus();
  }
</script>

<button class="btn-no-style" onclick={handleClick}>
  <span data-tooltip="Share" data-placement="right">
    <Icon name="tweet" />
  </span>
</button>

<style lang="scss">
</style>
