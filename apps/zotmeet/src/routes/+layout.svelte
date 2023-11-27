<script lang="ts">
  import {
    AppShell,
    AppBar,
    Drawer,
    LightSwitch,
    Toast,
    initializeStores,
  } from '@skeletonlabs/skeleton'
  import { QueryClientProvider } from '@tanstack/svelte-query'

  import type { PageData } from './$types'

  import '../app.css'

  export let data: PageData

  data.trpc.setContext(data.trpc.client, data.trpc.queryClient)
  initializeStores()
</script>

<QueryClientProvider client={data.trpc.queryClient}>
  <Drawer />
  <Toast />

  <AppShell>
    <svelte:fragment slot="header">
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
    </svelte:fragment>
    <slot />
  </AppShell>
</QueryClientProvider>
