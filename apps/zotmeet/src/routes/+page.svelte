<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { trpc } from '$lib/client/trpc'
  import ArrowCircleRightIcon from '~icons/material-symbols/arrow-circle-right'

  const mutation = trpc.reservations.create.createMutation()

  const DEFAULT_USERNAME = 'Anonymous'

  async function handleClick(event: Event): Promise<void> {
    event.preventDefault()
    const reservation = await $mutation.mutateAsync(
      $page.data.session?.user?.name ?? DEFAULT_USERNAME,
    )
    await goto(`/reservation/${reservation.id}`)
  }
</script>

<div class="px-8 py-16 max-w-4xl mx-auto">
  <div class="card">
    <header class="card-header text-4xl text-center font-semibold p-8">
      Coordinating meetings and so much more!
    </header>

    <section class="p-4 flex justify-center gap-8">
      <a href="/auth/login" class="btn variant-filled-primary">
        <ArrowCircleRightIcon class="w-6 h-6" />
        <span>Login with Oauth</span>
      </a>
    </section>

    <footer class="card-footer">
      <div class="p-8">
        <p class="text-4xl text-center font-semibold">Create a Reservation</p>
        <p class="opacity-50 text-lg text-center">Try creating a reservation without logging in.</p>
      </div>
      <div>
        <button type="submit" class="w-full btn variant-filled-secondary" on:click={handleClick}>
          Create Reservation
        </button>
      </div>
    </footer>
  </div>
</div>
