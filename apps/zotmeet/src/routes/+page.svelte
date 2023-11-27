<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { trpc } from '$lib/client/trpc'

  const mutation = trpc.reservations.create.createMutation()

  async function handleClick(event: Event): Promise<void> {
    event.preventDefault()
    const reservation = await $mutation.mutateAsync($page.data.session?.user?.id)
    await goto(`/reservation/${reservation.id}`)
  }
</script>

<div class="px-8 py-16 max-w-4xl mx-auto space-y-8">
  <div class="p-8 text-center">
    <h1 class="text-6xl md:text-7xl font-bold">
      <span
        class="bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400"
      >
        Schedule
      </span>
    </h1>
    <h1 class="text-6xl md:text-7xl font-bold">
      <span
        class="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"
      >
        Reserve
      </span>
    </h1>
    <h1 class="text-6xl md:text-7xl font-bold">
      <span
        class="bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"
      >
        ZotMeet
      </span>
    </h1>
  </div>

  <div class="card p-8">
    <section class="space-y-4">
      <div>
        <p class="text-4xl text-center font-semibold">Get Started</p>
      </div>

      <hr class="!border-t-4" />

      {#if $page.data.session?.user?.name == null}
        <div class="space-y-4">
          <p class="text-xl text-center">You must be logged in to create a reservation.</p>
          <a href="/auth/login" class="btn variant-filled-primary w-full"> Login </a>
        </div>
      {:else}
        <div class="space-y-4">
          <p class="text-3xl text-center">
            <span>Welcome, </span>
            <span class="font-bold">{$page.data.session.user.name}</span>
          </p>

          <button type="submit" class="w-full btn variant-filled-secondary" on:click={handleClick}>
            Create Reservation
          </button>
        </div>
      {/if}
    </section>
  </div>
</div>
