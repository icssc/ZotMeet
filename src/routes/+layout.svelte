<script>
  import "../app.pcss";
  import Header from "$lib/components/Header";
  import SideBar from "$lib/components/SideBar";
</script>

<div id="app-container">
  <Header />
  <aside id="sidebar-container">
    <SideBar />
  </aside>
  <slot />
</div>

<!-- Global styles -->
<style lang="postcss">
  :global(html) {
    font-family: sans-serif;
    font-size: 16px;
    line-height: 1.5;
    color: #333;
  }
</style>
