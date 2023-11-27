<script lang="ts">
  import { AppBar, LightSwitch } from '@skeletonlabs/skeleton'

  import logo from '$lib/assets/logo.png'
</script>

<AppBar>
  <svelte:fragment slot="lead">
    <div class="flex items-center">
      <a href="/" class="btn-icon btn-xl overflow-hidden">
        <img src={logo} alt="ZotMeet Logo" class="h-12 w-12" />
      </a>
    </div>
  </svelte:fragment>
  <div class="flex">
    <h1 class="text-4xl font-bold">ZotMeet</h1>
  </div>
  <svelte:fragment slot="trail">
    <div>
      <LightSwitch />
    </div>
  </svelte:fragment>
</AppBar>
