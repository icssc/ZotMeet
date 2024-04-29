<script lang="ts">
  import { onMount } from "svelte";

  import type { PageData } from "./$types";

  import { enhance } from "$app/forms";
  import { GroupAvailability, PersonalAvailability } from "$lib/components/availability";
  import type { AvailabilityInsertSchema } from "$lib/db/schema";
  import {
    availabilityDates,
    generateSampleDates,
    guestSession,
    isEditingAvailability,
    isStateUnsaved,
  } from "$lib/stores/availabilityStores";
  import { ZotDate } from "$lib/utils/ZotDate";
  import { cn } from "$lib/utils/utils";
  import CancelCircleOutline from "~icons/mdi/cancel-circle-outline";
  import CheckboxMarkerdCircleOutlineIcon from "~icons/mdi/checkbox-marked-circle-outline";

  export let data: PageData;

  let currentTab: number = 0;

  const handleSave = async (cancel: () => void) => {
    if (data.user) {
      return;
    }

    if ($guestSession.guestName && $guestSession.meetingId) {
      return;
    }

    const authModal = document.getElementById("auth-modal") as HTMLDialogElement;
    if (authModal) {
      authModal.showModal();
    }

    cancel(); // Prevent the form action, handle with LoginModal instead
  };

  async function getGuestAvailability() {
    const response = await fetch("/api/availability", {
      method: "POST",
      body: JSON.stringify($guestSession),
      headers: {
        "content-type": "application/json",
      },
    });

    const guestData: AvailabilityInsertSchema[] | null = await response.json();

    return guestData?.map(
      (availability) =>
        new ZotDate(
          new Date(availability.day),
          false,
          JSON.parse("[" + availability.availability_string + "]"),
        ),
    );
  }

  const getUserAvailability = () => {
    if (data.availability) {
      return data.availability?.map(
        (availability) =>
          new ZotDate(
            new Date(availability.day),
            false,
            JSON.parse("[" + availability.availability_string + "]"),
          ),
      );
    }
    return null;
  };

  const getGeneralAvailability = async () => {
    const userAvailability = getUserAvailability();

    if (userAvailability) {
      return userAvailability;
    }

    const guestAvailability = await getGuestAvailability();

    if (guestAvailability) {
      return guestAvailability;
    }

    return null;
  };

  const handleCancel = async () => {
    $availabilityDates = (await getGeneralAvailability()) ?? generateSampleDates();

    $isEditingAvailability = !$isEditingAvailability;
    $isStateUnsaved = false;
  };

  let innerWidth = 0;
  $: mobileView = innerWidth < 768;

  onMount(async () => {
    const generalAvailability = await getGeneralAvailability();
    $availabilityDates = generalAvailability ?? generateSampleDates();
  });

  let form: HTMLFormElement;
</script>

<svelte:window bind:innerWidth />

<div class="flex-between px-2 pt-8 md:px-4 md:pt-10 lg:px-[60px]">
  <h1 class="line-clamp-1 h-8 pr-2 font-montserrat text-xl font-medium md:h-fit md:text-3xl">
    Sample Meeting Winter 2024
  </h1>

  {#if $isEditingAvailability}
    <div class="flex space-x-2 md:space-x-4">
      <button
        class={cn(
          "flex-center btn btn-outline h-8 min-h-fit border-warning px-2 uppercase text-warning md:w-28 md:p-0",
          "hover:border-warning hover:bg-warning hover:text-white",
        )}
        on:click={handleCancel}
      >
        <span class="hidden md:flex">Cancel</span>
        <CancelCircleOutline />
      </button>

      <form
        bind:this={form}
        use:enhance={({ cancel }) => {
          handleSave(cancel);

          console.log("saving");

          return async ({ update }) => {
            update();

            $isEditingAvailability = false;
            $isStateUnsaved = false;
          };
        }}
        action={`/availability/${data.meetingId}?/saveAvailabilities`}
        method="POST"
        id="availabilitySaveForm"
        on:submit|preventDefault
      >
        <input type="hidden" name="availabilityDates" value={JSON.stringify($availabilityDates)} />
        <input type="hidden" name="username" value={$guestSession.guestName} />
        <button
          class={cn(
            "flex-center btn btn-outline h-8 min-h-fit border-secondary px-2 uppercase text-secondary md:w-24 md:p-0",
            "hover:border-secondary hover:bg-secondary hover:text-white",
          )}
          type="submit"
        >
          <span class="hidden md:flex">Save</span>
          <CheckboxMarkerdCircleOutlineIcon />
        </button>
      </form>
    </div>
  {/if}
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
      <PersonalAvailability columns={mobileView ? 4 : 5} {data} />
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
