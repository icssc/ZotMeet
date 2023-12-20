<script lang="ts">
  type Group = { name: string; id: number; img: string; link: string };
  export let groups: Group[];
</script>

<div class="flex flex-col gap-4">
  <h1 class="text-4xl font-bold">Groups</h1>
  <div class="flex gap-2 overflow-x-auto md:gap-4 snap-x snap-mandatory scroll-smooth">
    {#each groups as group (group.id)}
      <a href={group.link} target="_blank" referrerpolicy="no-referrer">
        <div
          class="flex h-24 p-3 bg-center bg-cover rounded-lg md:h-36 snap-start w-36 md:w-64 card"
          style="background-image: url({group.img})"
        >
          <p class="mt-auto font-bold text-white line-clamp-2 max-h-12">
            {group.name}
          </p>
        </div>
      </a>
    {/each}
  </div>
</div>
