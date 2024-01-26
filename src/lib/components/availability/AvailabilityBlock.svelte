<script lang="ts">
  import type { SelectionStateType } from "$lib/types/availability";

  export let isAvailable: boolean;
  export let zotDateIndex: number;
  export let blockIndex: number;
  export let selectionState: SelectionStateType | null;

  let backgroundColor: string = "";

  const getBlockColor = (selectionState: SelectionStateType | null): void => {
    // Render different background color if user is in middle of making a selection and is in range
    if (selectionState) {
      const { earlierDateIndex, laterDateIndex, earlierBlockIndex, laterBlockIndex } =
        selectionState;
      const dateInRange = earlierDateIndex <= zotDateIndex && zotDateIndex <= laterDateIndex;
      const timeInRange = earlierBlockIndex <= blockIndex && blockIndex <= laterBlockIndex;

      if (dateInRange && timeInRange) {
        backgroundColor = "bg-success-200";
        return;
      }
    }
    backgroundColor = isAvailable ? "bg-success-400" : "bg-neutral-200";
  };

  $: {
    getBlockColor(selectionState);
  }
</script>

<div
  data-date-index={zotDateIndex}
  data-block-index={blockIndex}
  class={`${backgroundColor} block h-full w-full py-2`}
></div>
