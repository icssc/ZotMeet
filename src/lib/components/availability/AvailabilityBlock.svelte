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
      const dateIsSelected = earlierDateIndex <= zotDateIndex && zotDateIndex <= laterDateIndex;
      const timeIsSelected = earlierBlockIndex <= blockIndex && blockIndex <= laterBlockIndex;

      if (dateIsSelected && timeIsSelected) {
        backgroundColor = "bg-success-100";
        return;
      }
    }
    backgroundColor = isAvailable ? "bg-success-400" : "bg-error-400";
  };

  $: {
    getBlockColor(selectionState);
  }
</script>

<div class={`${backgroundColor} block h-full w-full py-2`}></div>
