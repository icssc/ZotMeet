<script lang="ts">
  import "../app.pcss";
</script>

<slot />

<!-- Global styles -->
<style lang="postcss">
  @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap");
  @import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap");

  :global(html) {
    font-family:
      DM Sans,
      Montserrat,
      sans-serif;
    font-size: 16px;
    line-height: 1.5;
    color: #333;
  }
</style>
