<script lang="ts">
  import { QueryClientProvider } from '@tanstack/svelte-query'

  import type { PageData } from './$types'

  import '../app.css'

  export let data: PageData

  data.trpc.setContext(data.trpc.client, data.trpc.queryClient)
</script>

<QueryClientProvider client={data.trpc.queryClient}>
  <slot />
</QueryClientProvider>
