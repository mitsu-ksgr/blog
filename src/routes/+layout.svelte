<!----------------------------------------------------------------------------
  src/routes/+layout.svelte

  Layout
 !---------------------------------------------------------------------------->
<script lang="ts">
  import "./styles.css";
  import Header from "./Header.svelte";
  import Footer from "./Footer.svelte";

  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<div class="app">
  <div class="header">
    <Header />
  </div>

  <div class="container main">
    {@render children?.()}
  </div>

  <div class="footer">
    <Footer />
  </div>
</div>

<style lang="scss">
  .app {
    max-width: 1080px;
    margin: auto;

    display: grid;
    grid-template-columns: 1fr;
    grid-column-gap: 0px;
    grid-row-gap: 0px;

    padding: 3rem 10%;

    .header {
      border-bottom: solid 1px;
    }
    .main {
      padding-top: 2rem;
      padding-bottom: 2rem;
    }
    .footer {
      border-top: solid 1px;
    }
  }
</style>
