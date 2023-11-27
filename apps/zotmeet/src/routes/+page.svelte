<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { trpc } from '$lib/client/trpc'
  import ArrowCircleRightIcon from '~icons/material-symbols/arrow-circle-right'

  const mutation = trpc.reservations.create.createMutation()

  async function handleClick(event: Event): Promise<void> {
    event.preventDefault()
    const reservation = await $mutation.mutateAsync($page.data.session?.user?.name)
    await goto(`/reservation/${reservation.id}`)
  }
</script>

<div class="px-8 py-16 max-w-4xl mx-auto">
  <div class="card">
    <header class="card-header text-4xl text-center font-semibold p-8">
      Coordinating meetings and so much more!
    </header>

    <section class="card-body p-4 flex flex-col items-center gap-2">
      <a href="/auth/login" class="btn variant-filled-primary">
        <ArrowCircleRightIcon class="w-6 h-6" />
        <span>Login with Oauth</span>
      </a>
      <p class="opacity-50">Logging in allows you to edit the reservation</p>
    </section>

    <footer class="card-footer">
      <div class="p-4">
        <p class="text-4xl text-center font-semibold">Create a Reservation</p>
      </div>
      <div>
        <button type="submit" class="w-full btn variant-filled-secondary" on:click={handleClick}>
          Create Reservation
        </button>
      </div>
    </footer>
  </div>
</div>
