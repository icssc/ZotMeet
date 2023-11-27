<script lang="ts">
  import { page } from '$app/stores'
  import { trpc } from '$lib/client/trpc'

  const query = trpc.hello.createQuery({ text: 'Elysia' })
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
