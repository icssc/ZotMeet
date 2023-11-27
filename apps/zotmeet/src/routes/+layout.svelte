<script lang="ts">
  import { AppShell, AppBar } from '@skeletonlabs/skeleton'
  import { QueryClientProvider } from '@tanstack/svelte-query'

  import type { PageData } from './$types'

  import '../app.css'

  export let data: PageData

  data.trpc.setContext(data.trpc.client, data.trpc.queryClient)
</script>

<QueryClientProvider client={data.trpc.queryClient}>
  <AppShell>
    <svelte:fragment slot="header">
      <AppBar>
        <svelte:fragment slot="lead">(icon)</svelte:fragment>
        (title)
        <svelte:fragment slot="trail">(actions)</svelte:fragment>
      </AppBar>
    </svelte:fragment>
    <slot />
  </AppShell>
</QueryClientProvider>
