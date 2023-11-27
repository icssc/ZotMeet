<script lang="ts">
  import { trpc } from '$lib/client/trpc'
  import ArrowCircleRightIcon from '~icons/material-symbols/arrow-circle-right'

  const deleteEverythingMutation = trpc.reservations.deleteAllTimeSlots.createMutation()

  const utils = trpc.getContext()

  async function handleClick(): Promise<void> {
    await $deleteEverythingMutation.mutateAsync()
    await utils.reservations.invalidate()
  }
</script>

<div class="px-8 py-16 mx-auto max-w-6xl md:max-w-8xl">
  <div class="card p-8 space-y-8">
    <div>
      <h1
        class="text-6xl md:text-8xl bg-clip-text text-transparent font-bold text-center bg-gradient-to-br from-red-500 via-red-300 to-yellow-800"
      >
        Developers Only!
      </h1>
    </div>

    <div class="space-y-4">
      <div>
        <h2 class="text-4xl font-semibold text-center">Actions</h2>
      </div>

      <div class="flex flex-col gap-4">
        <button on:click={handleClick} class="w-full btn variant-filled-error">
          DELETE EVERYTHING
        </button>
      </div>
    </div>

    <hr class="!border-t-4" />

    <div class="space-y-4">
      <div>
        <h2 class="text-4xl font-semibold text-center">Links</h2>
      </div>

      <nav class="list-nav">
        <!-- (optionally you can provide a label here) -->
        <ul>
          <li>
            <a href="/csl">
              <span class="flex-auto">CSL data</span>
              <ArrowCircleRightIcon class="w-6 h-6" />
            </a>
          </li>
          <li>
            <a href="/science">
              <span class="flex-auto">Science Libarary data</span>
              <ArrowCircleRightIcon class="w-6 h-6" />
            </a>
          </li>
          <li>
            <a href="/timeslots">
              <span class="flex-auto">All Timeslots</span>
              <ArrowCircleRightIcon class="w-6 h-6" />
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</div>
