<script lang="ts">
  import type { PageData } from './$types'

  export let data: PageData

  let participantId = ''
</script>

<div>
  <p class="text-4xl text-center font-semibold">
    Reservation ID: {data.id}
  </p>
  <div>
    <label class="label">
      <span class="">Participant ID</span>
      <input type="text" bind:value={participantId} class="input" />
    </label>
  </div>
</div>
