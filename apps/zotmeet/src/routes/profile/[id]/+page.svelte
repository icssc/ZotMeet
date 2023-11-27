<script lang="ts">
  import { page } from '$app/stores'
  import { trpc } from '$lib/client/trpc'
  import ArrowCircleRightIcon from '~icons/material-symbols/arrow-circle-right'

  const reservationsQuery = trpc.reservations.getByUserId.createQuery(
    $page.data.session?.user?.id ?? '',
  )
</script>

<div class="mx-auto max-w-5xl px-8 py-16 flex flex-col gap-8">
  <div>
    <h2 class="text-6xl md:text-8xl text-center font-bold">
      {$page.data.session?.user?.name}
    </h2>
  </div>

  <div>
    <div class="card">
      <header class="card-header text-4xl text-center font-semibold">
        <h3>Reservations</h3>
      </header>

      <hr class="!border-t-8 my-2" />

      <section class="p-4">
        <nav class="list-nav">
          <ul>
            {#each $reservationsQuery.data ?? [] as reservation, index (reservation.id)}
              <li>
                <a href="/reservation/{reservation.id}">
                  <span class="flex-auto">{reservation.id}</span>
                  <ArrowCircleRightIcon class="w-6 h-6" />
                </a>

                {#if $reservationsQuery.data != null && index < $reservationsQuery.data.length}
                  <hr class="!border-t-2 my-2" />
                {/if}
              </li>
            {/each}
          </ul>
        </nav>
      </section>
    </div>
  </div>
</div>
