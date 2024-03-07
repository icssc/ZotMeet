<script lang="ts">
  import { PersonalAvailability } from "$lib/components/availability";
  import GroupAvailability from "$lib/components/availability/GroupAvailability.svelte";
  import PencilOutlineIcon from "~icons/mdi/pencil-outline";

  let currentTab: number = 0;
</script>

<div class="flex-between px-2 pt-8 md:px-4 md:pt-10 lg:px-[60px]">
  <h1 class="line-clamp-1 font-montserrat text-xl font-medium md:text-3xl">
    Sample Meeting Winter 2024
  </h1>

  <button
    class="flex-center btn btn-outline h-8 min-h-fit px-2 uppercase text-slate-medium md:w-24 md:p-0"
  >
    <span class="hidden md:flex">Edit</span>
    <PencilOutlineIcon />
  </button>
</div>

<div role="tablist" class="tabs tabs-bordered w-full px-2 md:px-4 lg:max-w-md lg:pl-[60px]">
  <button
    role="tab"
    class="tab font-montserrat font-medium text-gray-400 lg:text-lg"
    class:tab-active={currentTab === 0}
    class:text-gray-800={currentTab === 0}
    style:border-color={currentTab === 0 ? "oklch(var(--a))" : undefined}
    on:click={() => {
      currentTab = 0;
    }}>My Availability</button
  >
  <button
    role="tab"
    class="tab font-montserrat font-medium text-gray-400 lg:text-lg"
    class:tab-active={currentTab === 1}
    class:text-gray-800={currentTab === 1}
    style:border-color={currentTab === 1 ? "oklch(var(--a))" : undefined}
    on:click={() => {
      currentTab = 1;
    }}>Group Availability</button
  >
</div>

<div>
  {#if currentTab === 0}
    <div
      class="w-full rounded-box border-base-300 bg-base-100 bg-gradient-to-l from-[#F680670D] to-[#377CFB0D] p-2 pt-4 md:p-6"
    >
      <div class="hidden md:flex">
        <PersonalAvailability columns={5} />
      </div>

      <div class="flex md:hidden">
        <PersonalAvailability columns={4} />
      </div>
    </div>
  {:else if currentTab === 1}
    <div
      class="rounded-box border-base-300 bg-base-100 bg-gradient-to-l from-[#00A96E0D] to-[#377CFB0D] p-2 pt-4 md:p-6 lg:pr-0"
    >
      <div class="hidden md:flex md:items-start">
        <GroupAvailability columns={5} />
      </div>
      <div class="block md:hidden">
        <GroupAvailability columns={4} />
      </div>
    </div>
  {/if}
</div>
