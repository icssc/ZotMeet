<script lang="ts">
  import { getDrawerStore, getToastStore } from '@skeletonlabs/skeleton'

  import { page } from '$app/stores'
  import { trpc } from '$lib/client/trpc'

  const query = trpc.hello.createQuery({ text: 'Elysia' })

  const drawerStore = getDrawerStore()
  const toastStore = getToastStore()

  toastStore.trigger({
    message: 'Lorem ipsum dolor sit amet consectetur adipisicing elit...',
  })

  drawerStore.open({
    id: 'example-3',
    // Provide your property overrides:
    bgDrawer: 'bg-purple-900 text-white',
    bgBackdrop: 'bg-gradient-to-tr from-indigo-500/50 via-purple-500/50 to-pink-500/50',
    width: 'w-[280px] md:w-[480px]',
    padding: 'p-4',
    rounded: 'rounded-xl',
  })
</script>

<div class="container mx-auto p-8 space-y-8">
  <h1 class="h1">{$query.data?.greeting} {$page.data.user?.name}</h1>
  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
  <section>
    <a class="btn variant-filled-primary" href="https://kit.svelte.dev/">SvelteKit</a>
    <a class="btn variant-filled-secondary" href="https://tailwindcss.com/">Tailwind</a>
    <a class="btn variant-filled-tertiary" href="https://github.com/">GitHub</a>
  </section>
</div>
