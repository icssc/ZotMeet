<script lang="ts">
  import { ListBox, ListBoxItem, getModalStore } from "@skeletonlabs/skeleton";
  import type { SvelteComponent } from "svelte";

  import { attendees, members } from "$lib/stores/groupStores";

  // Props
  /** Exposes parent props to this component. */
  export let parent: SvelteComponent;

  // Local

  const modalStore = getModalStore();

  // Base Classes
  const cBase = "card p-4 w-modal shadow-xl space-y-4";
  const cHeader = "text-2xl font-bold";
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
  <div class="modal-example-form {cBase}">
    <header class={cHeader}>{$modalStore[0].title ?? "(title missing)"}</header>

    <ListBox class="border border-surface-500 p-4 rounded-container-token">
      {#each $members as member (member.id)}
        <ListBoxItem bind:group={$attendees} name={member.username} value={member.id}
          >{member.username}</ListBoxItem
        >
      {/each}
    </ListBox>
    <!-- prettier-ignore -->
    <footer class="modal-footer {parent.regionFooter}">
      <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>Close</button>
    </footer>
  </div>
{/if}
