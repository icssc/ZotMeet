<script lang="ts">
  import '../app.css'

  import { AppShell, Drawer, Toast, initializeStores } from '@skeletonlabs/skeleton'
  import { QueryClientProvider } from '@tanstack/svelte-query'

  import type { PageData } from './$types'

  import Header from '$lib/components/layout/Header.svelte'

  export let data: PageData

  data.trpc.setContext(data.trpc.client, data.trpc.queryClient)
  initializeStores()
</script>

<QueryClientProvider client={data.trpc.queryClient}>
  <Drawer />
  <Toast />

  <AppShell>
    <svelte:fragment slot="header">
      <Header />
    </svelte:fragment>

    <slot />
  </AppShell>
</QueryClientProvider>
