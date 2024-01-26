<script lang="ts">
  import { goto } from "$app/navigation";

  const onClick = () => {
    goto("/availability-sample");
  };
</script>

<button type="button" class="variant-filled btn mx-auto my-5 h-12 w-full" on:click={onClick}
  >Create Event</button
>
