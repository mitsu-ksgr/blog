<!-----------------------------------------------------------------------------
  Header.svelte

  Header component
 !----------------------------------------------------------------------------->
<script lang="ts">
  import { base } from "$app/paths";

  import ThemeSwitch from "$lib/ui/ThemeSwitch.svelte";
  import TweetButton from "$lib/ui/TweetButton.svelte";

  const links = [
    {
      title: "Archives",
      url: `${base}/archives`,
    },
    {
      title: "Category",
      url: `${base}/categories`,
    },
    {
      title: "Tags",
      url: `${base}/tags`,
    },
  ];
</script>

<div class="">
  <div class="title">
    <h1><a href={base}>みつのーと v2.0</a></h1>
  </div>

  <nav>
    <ul>
      <li><TweetButton /></li>
    </ul>
    <ul>
      {#each links as link}
        <li>
          <a href={link.url}>
            {link.title}
          </a>
        </li>
      {/each}
    </ul>
    <ul>
      <li><ThemeSwitch /></li>
    </ul>
  </nav>
</div>

<style lang="scss">
  .title {
    text-align: center;
    h1 {
      margin-bottom: 0px;

      a,
      a:hover,
      a:visited {
        text-decoration: none;
        color: inherit;
      }
    }
  }
</style>
