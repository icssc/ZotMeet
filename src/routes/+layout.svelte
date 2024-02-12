<script lang="ts">
  import "../app.pcss";
</script>

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
