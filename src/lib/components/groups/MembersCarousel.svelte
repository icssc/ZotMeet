<script lang="ts">
  import { members } from "$lib/stores/groupStores";
</script>

<div class="flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth md:gap-4">
  {#each $members as member (member.id)}
    <a href={member.profile_page} target="_blank" referrerpolicy="no-referrer">
      <div
        class="card flex h-24 w-24 snap-start rounded-lg bg-cover bg-center px-2 md:h-40 md:w-40"
        style="background-image:url({member.profile_picture})"
      ></div>
      <p class="mt-auto line-clamp-2 max-h-12 text-left text-lg font-bold text-black md:text-xl">
        @{member.username}
      </p>
    </a>
  {/each}
</div>
