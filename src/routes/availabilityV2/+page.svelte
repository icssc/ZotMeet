<script lang="ts">
  import { PersonalAvailability } from "$lib/components/availability";
  import { cn } from "$lib/utils/utils";
  import PencilOutlineIcon from "~icons/mdi/pencil-outline";
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

<div role="tablist" class="tabs tabs-lifted w-full px-0 md:px-2">
  <input
    type="radio"
    name="availabilityTabs"
    role="tab"
    class="tab disabled invisible max-w-[10px] overflow-clip whitespace-nowrap md:max-w-[60px]"
    aria-label="SPACERSPACERSPACER"
  />

  <input
    type="radio"
    name="availabilityTabs"
    role="tab"
    class={cn(
      "tab flex-auto appearance-none whitespace-nowrap font-montserrat text-sm text-gray-medium after:px-2 md:text-xl",
      "from-[#377CFB0D] to-[#377CFB0D] checked:bg-gradient-to-l checked:text-gray-dark checked:ring-0 checked:ring-transparent active:ring-0 active:ring-transparent",
    )}
    aria-label="My Availability"
    checked
  />

  <div
    role="tabpanel"
    class="tab-content w-full rounded-box border-base-300 bg-base-100 bg-gradient-to-l from-[#F680670D] to-[#377CFB0D] p-2 pt-4 md:p-6"
  >
    <!-- Desktop -->
    <div class="hidden md:flex">
      <PersonalAvailability columns={5} />
    </div>

    <!-- Mobile -->
    <div class="flex md:hidden">
      <PersonalAvailability columns={4} />
    </div>
  </div>

  <input
    type="radio"
    name="availabilityTabs"
    role="tab"
    class={cn(
      "tab flex-auto appearance-none whitespace-nowrap font-montserrat text-sm text-gray-medium after:px-2 md:text-xl",
      "from-[#377CFB0D] to-[#377CFB0D] checked:bg-gradient-to-l checked:text-gray-dark checked:ring-0 checked:ring-transparent active:ring-0 active:ring-transparent",
    )}
    aria-label="Group Availability"
  />

  <div
    role="tabpanel"
    class="tab-content rounded-box border-base-300 bg-base-100 bg-gradient-to-l from-[#00A96E0D] to-[#377CFB0D] p-6"
  >
    Tab content 2
  </div>
</div>
