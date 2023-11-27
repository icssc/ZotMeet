<script lang="ts">
  import { trpc } from '$lib/client/trpc'

  const query = trpc.hello.createQuery({ text: 'Elysia' })
</script>

<div class="p-4">
  <p class="text-7xl text-center font-bold">{$query.data?.greeting}</p>
</div>
