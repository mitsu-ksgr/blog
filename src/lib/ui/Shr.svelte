<!----------------------------------------------------------------------------
  Shr.svelte

  Sukoshi-osyare hr.
 !---------------------------------------------------------------------------->
<script lang="ts">
  interface Props {
    style?: string;
  }

  let { style = "simple" }: Props = $props();
</script>

<hr class="{style}" />

<style lang="scss">
  /* Reset */
  hr {
    height: 0;
    margin: 0;
    padding: 0;
    border: 0;
    overflow: visible;
  }

  /* Styles */
  .simple {
    border-top: 1px solid;
  }

  .dashed {
    border-top: thin dashed;
  }

  .gradient {
    height: 1px;
    background-image: -webkit-gradient(
      linear,
      left top,
      right top,
      from(transparent),
      color-stop(#ccc),
      to(transparent)
    );
    background-image: linear-gradient(to right, transparent, #ccc, transparent);
  }

  .slash {
    height: 8px;
    background-image: repeating-linear-gradient(
      135deg,
      #ccc 0,
      #ccc 1px,
      transparent 0,
      transparent 50%
    );
    background-size: 8px 8px;
    background-repeat: repeat;
  }

  .back-slash {
    height: 8px;
    background-image: repeating-linear-gradient(
      45deg,
      #ccc 0,
      #ccc 1px,
      transparent 0,
      transparent 50%
    );
    background-size: 8px 8px;
    background-repeat: repeat;
  }

  .cross {
    height: 8px;
    background-image:
      repeating-linear-gradient(
        45deg,
        #ccc 0,
        #ccc 1px,
        transparent 0,
        transparent 50%
      ),
      repeating-linear-gradient(
        135deg,
        #ccc 0,
        #ccc 1px,
        transparent 0,
        transparent 50%
      );
    background-size: 8px 8px;
    background-repeat: repeat;
  }
</style>
