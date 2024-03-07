<script lang="ts">
  import { groups } from "$lib/stores/summaryStores";
</script>

<div
  class="gray-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1 md:gap-4"
>
  {#each $groups as group (group.id)}
    <a href={group.link}>
      <div
        class="flex h-24 snap-start gap-2 rounded-xl border-[1px] border-gray-300 bg-gray-50 p-2 pr-4 lg:h-28 lg:pr-8"
      >
        <div class="h-full min-w-[5rem] lg:min-w-[6rem]">
          <img class="h-full w-full rounded-md object-cover" src={group.img} alt={group.name} />
        </div>
        <div class="flex flex-col justify-center">
          <div class="avatar-group -space-x-3 rtl:space-x-reverse">
            <div class="avatar">
              <div class="w-6">
                <img
                  src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                  alt=""
                />
              </div>
            </div>
            <div class="avatar">
              <div class="w-6">
                <img
                  src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                  alt=""
                />
              </div>
            </div>
            <div class="avatar">
              <div class="w-6">
                <img
                  src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                  alt=""
                />
              </div>
            </div>
            <div class="avatar placeholder">
              <div class="w-6 bg-slate-200 text-[0.625rem] font-semibold text-slate-400">
                <span>+99</span>
              </div>
            </div>
          </div>
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

<style>
  .gray-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #bfc8d5 #e5e7eb;
  }

  .gray-scrollbar::-webkit-scrollbar {
    width: 16px;
  }

  .gray-scrollbar::-webkit-scrollbar-track {
    background: #bfc8d5;
  }

  .gray-scrollbar::-webkit-scrollbar-thumb {
    background-color: #bfc8d5;
    border-radius: 16px;
    border: 4px solid #ffffff;
  }
</style>
