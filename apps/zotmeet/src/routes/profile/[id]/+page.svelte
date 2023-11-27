<script lang="ts">
  import { page } from '$app/stores'
  import { trpc } from '$lib/client/trpc'

  const reservations = trpc.reservations.byId
</script>

<div class="px-8 py-16">
  <div class="mx-auto text-4xl text-center font-semibold max-w-5xl">
    <div class="card">
      <header class="card-header">
        <h2 class="">
          {$page.data.session?.user?.name}
        </h2>
      </header>
      <section class="p-4"></section>
    </div>
  </div>
</div>
