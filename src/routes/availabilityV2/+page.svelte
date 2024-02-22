<script lang="ts">
  import { PersonalAvailability } from "$lib/components/availability";
  import { cn } from "$lib/utils/utils";
  import PencilOutlineIcon from "~icons/mdi/pencil-outline";

  // let currentTab: number = 0;
</script>

<div class="flex-between px-2 pt-8 md:px-4 md:pt-10 lg:px-[60px]">
  <h1 class="font-montserrat text-xl font-semibold md:text-2xl">Sample Meeting Winter 2024</h1>

  <button class="btn btn-outline h-8 min-h-fit w-24 p-0 uppercase text-slate-medium">
    Edit <PencilOutlineIcon />
  </button>
</div>

<div role="tablist" class="tabs tabs-lifted w-full px-2">
  <input
    type="radio"
    name="my_tabs_2"
    role="tab"
    class="tab disabled invisible max-w-[60px] overflow-clip whitespace-nowrap"
    aria-label="SPACERSPACERSPACER"
  />

  <input
    type="radio"
    name="my_tabs_2"
    role="tab"
    class={cn(
      "tab flex-auto appearance-none whitespace-nowrap font-montserrat text-xl text-gray-medium after:px-2",
      "from-[#377CFB0D] to-[#377CFB0D] checked:bg-gradient-to-l checked:text-gray-dark checked:ring-0 checked:ring-transparent active:ring-0 active:ring-transparent",
    )}
    aria-label="My Availability"
    checked
  />

  <div
    role="tabpanel"
    class="tab-content w-full rounded-box border-base-300 bg-base-100 bg-gradient-to-l from-[#00A96E0D] to-[#377CFB0D] p-6"
  >
    <PersonalAvailability />
  </div>

  <input
    type="radio"
    name="my_tabs_2"
    role="tab"
    class={cn(
      "tab flex-auto appearance-none whitespace-nowrap font-montserrat text-xl text-gray-medium after:px-2",
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
