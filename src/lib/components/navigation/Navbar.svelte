<script lang="ts">
  import LogoArea from "./shared/LogoArea.svelte";
  import NavButtons from "./shared/NavButtons.svelte";
  import ProfileCard from "./shared/ProfileCard.svelte";

  import CloseIcon from "~icons/material-symbols/close";
  import MenuIcon from "~icons/material-symbols/menu";
</script>

<div class="drawer drawer-end md:hidden">
  <input id="nav-drawer" type="checkbox" class="drawer-toggle" />

  <div class="drawer-content flex flex-col">
    <div class="flex-between navbar bg-gray-light px-5 py-4 md:hidden">
      <LogoArea />

      <label class="btn btn-square btn-ghost" for="nav-drawer">
        <MenuIcon class="h-8 w-8" />
      </label>
    </div>
  </div>

  <div class="drawer-side z-50">
    <label for="nav-drawer" aria-label="close sidebar" class="drawer-overlay"></label>

    <div class="flex h-full w-[80%] flex-col bg-slate-100 sm:w-[60%]">
      <div class="flex h-20 items-center justify-end px-5 py-4">
        <label class="btn btn-square btn-ghost" for="nav-drawer">
          <CloseIcon class="h-8 w-8" />
        </label>
      </div>

      <NavButtons />
      <ProfileCard />
    </div>
  </div>
</div>
