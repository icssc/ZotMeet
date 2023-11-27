<script lang="ts">
  import { getModalStore } from '@skeletonlabs/skeleton'

  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { trpc } from '$lib/client/trpc'
  import ArrowCircleRightIcon from '~icons/material-symbols/arrow-circle-right'

  const mutation = trpc.reservations.create.createMutation()

  const modalStore = getModalStore()

  async function handleClick(event: Event): Promise<void> {
    event.preventDefault()

    if ($page.data.session?.user?.name == null) {
      modalStore.trigger({
        title: 'Login Required',
        type: 'alert',
        body: 'You must be logged in to create a reservation.',
      })
      return
    }

    const reservation = await $mutation.mutateAsync($page.data.session?.user?.name)
    await goto(`/reservation/${reservation.id}`)
  }
</script>

<div class="px-8 py-16 max-w-4xl mx-auto">
  <div class="card">
    <header class="card-header text-4xl text-center font-semibold p-8">
      Coordinating meetings and so much more!
    </header>

    {#if $page.data.session?.user?.name == null}
      <section class="p-4 flex justify-center gap-8">
        <a href="/auth/login" class="btn variant-filled-primary">
          <ArrowCircleRightIcon class="w-6 h-6" />
          <span>Login with Oauth</span>
        </a>
      </section>
    {:else}
      <footer class="card-footer">
        <div class="p-8">
          <p class="text-4xl text-center font-semibold">Create a Reservation</p>
        </div>
        <div>
          <button type="submit" class="w-full btn variant-filled-secondary" on:click={handleClick}>
            Create Reservation
          </button>
        </div>
      </footer>
    {/if}
  </div>
</div>
