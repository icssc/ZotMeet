<script lang="ts">
  import type { Group } from "$lib/types/meetings";

  export let groups: Group[];
</script>

<div class="flex gap-2 overflow-x-auto md:gap-4 snap-x snap-mandatory scroll-smooth">
  {#each groups as group (group.id)}
    <a href={group.link} target="_blank" referrerpolicy="no-referrer">
      <div
        class="flex h-24 p-3 bg-center bg-cover rounded-lg md:h-36 snap-start w-36 md:w-64 card"
        style="background-image:url({group.img})"
      >
        <p class="mt-auto text-lg font-bold text-white md:text-xl line-clamp-2 max-h-12">
          {group.name}
        </p>
      </div>
    </a>
  {/each}
</div>
