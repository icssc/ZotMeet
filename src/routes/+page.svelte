<script lang="ts">
  import Calendar from "$lib/components/CalendarV2/Calendar.svelte";
  import SideBar from "$lib/components/SidebarV2/SideBar.svelte";
</script>

<main
  class="flex h-full min-h-screen w-full flex-row bg-gradient-to-l from-[#EEEEEE] to-[#EAEFF2] pl-6 pt-6"
>
  <SideBar />

  <div class="flex min-h-full w-full flex-col gap-y-6 rounded-tl-xl border-2 bg-white px-4 pb-6">
    <div class="pt-6">
      <h1 class="font-montserrat text-2xl font-medium">Let's start planning your next meeting.</h1>
      <h2 class="text-base text-gray-medium">
        Select any dates and a time range that could work for you and your team.
      </h2>
    </div>

    <Calendar />
  </div>
</main>
