<script lang="ts">
  import { groups } from "$lib/stores/summaryStores";
</script>

<div class="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth md:gap-4">
  {#each $groups as group (group.id)}
    <a href={group.link}>
      <div
        class="flex h-24 snap-start gap-2 rounded-xl border-[1px] border-gray-300 bg-gray-50 p-2 pr-4 lg:h-28"
      >
        <div class="h-full min-w-[5rem] lg:min-w-[6rem]">
          <img class="h-full w-full rounded-md object-cover" src={group.img} alt={group.name} />
        </div>
        <div class="flex flex-col justify-center">
          <p
            class="whitespace-nowrap text-xl font-semibold leading-5 text-gray-800 lg:text-2xl lg:leading-6"
          >
            {group.name}
          </p>
          <p class="text-xs font-medium text-gray-400 lg:text-sm">Bottom text</p>
        </div>
      </div>
    </a>
  {/each}
</div>
