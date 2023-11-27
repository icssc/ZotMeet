<script lang="ts">
  import '../app.css'

  import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom'
  import {
    AppShell,
    Drawer,
    Modal,
    Toast,
    initializeStores,
    storePopup,
  } from '@skeletonlabs/skeleton'
  import { QueryClientProvider } from '@tanstack/svelte-query'

  import type { PageData } from './$types'

  import Header from '$lib/components/layout/Header.svelte'

  export let data: PageData

  data.trpc.setContext(data.trpc.client, data.trpc.queryClient)
  initializeStores()
  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow })
</script>

<QueryClientProvider client={data.trpc.queryClient}>
  <Drawer />
  <Modal />
  <Toast />

  <AppShell>
    <svelte:fragment slot="header">
      <Header />
    </svelte:fragment>

    <slot />
  </AppShell>
</QueryClientProvider>
