<!-----------------------------------------------------------------------------
  Footer.svelte

  Footer component
 !----------------------------------------------------------------------------->
<script lang="ts">
  import { base } from "$app/paths";

  import Icon from "$lib/ui/Icon.svelte";
  import ExLink from "$lib/ui/ExLink.svelte";

  const links = [
    {
      title: "RSS",
      url: `${base}/feed/rss.xml`,
      icon: "rss",
    },
    {
      title: "GitHub",
      url: "https://github.com/mitsu-ksgr",
      icon: "github",
    },
    {
      title: "Twitter",
      url: "https://twitter.com/mitsu_ksgr",
      icon: "twitter",
    },
    {
      title: "WishList",
      url: "https://www.amazon.co.jp/hz/wishlist/ls/2EH54O2QHEEDE",
      icon: "gift",
    },
  ];
</script>

<section>
  <div class="icons">
    {#each links as link}
      <div class="icon">
        <ExLink link={link.url} noExIcon>
          <Icon name={link.icon} />
        </ExLink>
      </div>
    {/each}
  </div>

  <div>
    <small>© mitsu-ksgr</small>
  </div>
</section>

<style lang="scss">
  section {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;

    .icons {
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;

      .icon {
        padding: 1em;
      }
    }
  }
</style>
