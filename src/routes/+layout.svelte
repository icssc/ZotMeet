<script>
  import { LightSwitch } from "@skeletonlabs/skeleton";
  import "../app.pcss";
</script>

<LightSwitch />
<slot />

<!-- Global styles -->
<style lang="postcss">
  :global(html) {
    font-family: sans-serif;
    font-size: 16px;
    line-height: 1.5;
    color: #333;
  }
</style>
