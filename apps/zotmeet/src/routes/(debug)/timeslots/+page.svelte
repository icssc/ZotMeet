<script lang="ts">
  import { trpc } from '$lib/client/trpc'

  const query = trpc.reservations.getAllTimeSlots.createQuery()
</script>

<div>
  <h1>Debugging Route</h1>
  <div>
    <pre>{JSON.stringify($query.data, null, 2)}</pre>
  </div>
</div>
