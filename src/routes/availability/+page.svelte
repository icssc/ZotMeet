<script lang="ts">
  import { PersonalAvailability } from "$lib/components/availability";

  type AvailabilityTabType = "personal" | "group";

  let currentTab: AvailabilityTabType = "personal";
</script>

<main class="h-full min-h-screen w-full bg-surface-100">
  <section class="mx-auto max-w-xl p-5">
    <div class="flex justify-center gap-2">
      <button
        on:click={() => {
          currentTab = "personal";
        }}>My Availability</button
      >
      <button
        on:click={() => {
          currentTab = "group";
        }}>Group Availability</button
      >
    </div>
    {#if currentTab === "personal"}
      <PersonalAvailability />
    {/if}
  </section>
</main>
