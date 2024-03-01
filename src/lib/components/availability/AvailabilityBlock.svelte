<script lang="ts">
  import type { SelectionStateType } from "$lib/types/availability";
  import { cn } from "$lib/utils/utils";

  export let isAvailable: boolean;
  export let zotDateIndex: number;
  export let blockIndex: number;
  export let selectionState: SelectionStateType | null;

  let backgroundColor: string = "";

  /**
   * Updates the background color of a single time block cell
   * @param selectionState the current boundaries describing the user's selection
   */
  const updateBlockColor = (selectionState: SelectionStateType | null): void => {
    // Render different background color if user is in middle of making a selection and is in range
    if (selectionState) {
      const { earlierDateIndex, laterDateIndex, earlierBlockIndex, laterBlockIndex } =
        selectionState;
      const dateInRange = earlierDateIndex <= zotDateIndex && zotDateIndex <= laterDateIndex;
      const timeInRange = earlierBlockIndex <= blockIndex && blockIndex <= laterBlockIndex;

      if (dateInRange && timeInRange) {
        backgroundColor = "bg-[#BFD1F5]";
        return;
      }
    }
    backgroundColor = isAvailable ? "bg-primary" : "bg-transparent";
  };

  $: {
    updateBlockColor(selectionState);
  }
</script>

<div
  data-date-index={zotDateIndex}
  data-block-index={blockIndex}
  class={cn("block h-full w-full py-2", backgroundColor)}
/>
