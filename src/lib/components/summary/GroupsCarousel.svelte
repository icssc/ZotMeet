<script lang="ts">
  import { groups } from "$lib/stores/summaryStores";
</script>

<div class="flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth md:gap-4">
  {#each $groups as group (group.id)}
    <a href={group.link} target="_blank" referrerpolicy="no-referrer">
      <div
        class="card flex h-24 w-36 snap-start rounded-lg bg-cover bg-center p-3 md:h-36 md:w-64"
        style="background-image:url({group.img})"
      >
        <p class="mt-auto line-clamp-2 max-h-12 text-lg font-bold text-white md:text-xl">
          {group.name}
        </p>
      </div>
    </a>
  {/each}
</div>
