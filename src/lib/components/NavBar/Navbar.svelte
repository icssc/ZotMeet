<script lang="ts">
  import MenuIcon from "~icons/material-symbols/menu";
</script>

<div class="navbar bg-gray-light px-5 py-4 md:hidden">
  <div class="flex flex-grow">
    <a href="/" class="flex items-center space-x-4">
      <div class="h-8 w-8 rounded-lg border-2 border-black bg-primary" />
      <h1 class="font-montserrat text-3xl font-semibold text-gray-dark">ZotMeet</h1>
    </a>
  </div>

  <div class="flex-none">
    <button class="btn btn-square btn-ghost">
      <MenuIcon class="h-8 w-8" />
    </button>
  </div>
</div>
