<script lang="ts">
  import { groupAvailabilities } from "$lib/stores/availabilityStores";
  import { cn } from "$lib/utils/utils";

  export let availableMemberIndices: number[] | null;
  export let tableCellStyles: string;
  export let onHover = () => {};
  export let onClick = () => {};

  const calculateGroupBlockColor = (availableMemberIndices: number[] | null): string => {
    if (availableMemberIndices) {
      const opacity = availableMemberIndices.length / $groupAvailabilities.length;
      return `rgba(55, 124, 251, ${opacity})`;
    }
    return "transparent";
  };
</script>

<button
  tabindex="0"
  class={cn("h-full w-full border-r-[1px] border-gray-medium", tableCellStyles, $$props.class)}
  on:click={onClick}
  on:mouseenter={onHover}
>
  <div
    class="block h-full w-full py-2"
    style:background-color={calculateGroupBlockColor(availableMemberIndices)}
  ></div>
</button>
