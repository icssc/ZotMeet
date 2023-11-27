<script lang="ts">
  import { trpc } from '$lib/client/trpc'

  const deleteEverythingMutation = trpc.reservations.deleteAllTimeSlots.createMutation()

  const utils = trpc.getContext()

  async function handleClick(): Promise<void> {
    await $deleteEverythingMutation.mutateAsync()
    await utils.reservations.invalidate()
  }
</script>

<div class="card px-8 py-16">
  <div>
    <h1>Developers Only!</h1>
  </div>

  <div>
    <button on:click={handleClick} class="btn variant-filled">DELETE EVERYTHING</button>
  </div>
</div>
