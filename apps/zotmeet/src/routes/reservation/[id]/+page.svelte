<script lang="ts">
  import type { PageData } from '../$types'

  export let data: PageData
</script>

<div>
  <p class="text-4xl text-center font-semibold">
    Reservation ID: {data.id}
  </p>
</div>
