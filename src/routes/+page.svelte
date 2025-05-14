<!----------------------------------------------------------------------------
  src/routes/+page.svelte

  Top page
 !---------------------------------------------------------------------------->
<script lang="ts">
  import { base } from "$app/paths";

  import Icon from "$lib/ui/Icon.svelte";
  import ExLink from "$lib/ui/ExLink.svelte";
  import Shr from "$lib/ui/Shr.svelte";

  let { data } = $props();
  let latests = $derived(data["entries"].reverse().slice(0, 5));
</script>

<svelte:head>
  <title>みつのーと</title>
  <meta name="description" content="みつのーと" />
</svelte:head>

<section>
  <div class="content">
    <p>
      こんにちは、みつです。 プログラマです。<br />
      ほどほどにがんばってます・・・。
    </p>

    <p>
      最近は Rust が楽しい。
    </p>

    <div style="margin-bottom: 1.5rem;">
      <Shr style="slash" />
    </div>

    <p>
      何かあれば Twitter (現X) の DM にご連絡ください。
    </p>

    <div class="sns">
      <div class="item">
        <Icon name="person" />
        <span>
          Profile ...
          <ExLink link="https://www.ksgr.net/">ksgr.net</ExLink>
        </span>
      </div>
      <div class="item">
        <Icon name="github" />
        <span>
          GitHub ...
          <ExLink link="https://github.com/mitsu-ksgr">mitsu-ksgr</ExLink>
        </span>
      </div>
      <div class="item">
        <Icon name="twitter" />
        <span>
          Twitter ...
          <ExLink link="https://twitter.com/mitsu_ksgr">mitsu_ksgr</ExLink>
        </span>
      </div>
    </div>
  </div>

  <div class="articles">
    <h4>最近の記事</h4>
    <ul>
      {#each latests as entry}
        <li>
          <a href={entry.link}>
            {entry.created.slice(0, 10)} ... {entry.title}
          </a>
        </li>
      {/each}
    </ul>
    <a href="{base}/archives">もっとみる</a>
  </div>
</section>

<style lang="scss">
  .content {
    padding-bottom: 2rem;

    .sns {
      .item {
        margin-bottom: 0.25rem;
        span {
          margin-left: 0.25rem;
        }
      }
    }
  }

  .articles {
    h4 {
      margin-bottom: 0.5rem;
    }
    ul {
      margin-left: 1rem;
    }
  }
</style>
