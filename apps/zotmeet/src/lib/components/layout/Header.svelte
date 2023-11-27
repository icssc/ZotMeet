<script lang="ts">
  import { AppBar, LightSwitch } from '@skeletonlabs/skeleton'
</script>

<AppBar>
  <svelte:fragment slot="lead">(icon)</svelte:fragment>
  <div class="flex justify-center">
    <h1 class="text-6xl font-bold">ZotMeet</h1>
  </div>
  <svelte:fragment slot="trail">
    <div>
      <LightSwitch />
    </div>
  </svelte:fragment>
</AppBar>
