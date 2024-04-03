<script lang="ts">
  import type { PageData } from "../../../routes/$types";

  import LogoArea from "./shared/LogoArea.svelte";
  import NavButtons from "./shared/NavButtons.svelte";
  import ProfileCard from "./shared/ProfileCard.svelte";

  export let data: PageData;
</script>

<div class="hidden min-h-full min-w-[250px] flex-col pr-3 md:flex md:pt-4 xl:min-w-[300px]">
  <LogoArea />

  <div class="divider my-1" />

  <NavButtons />
  <ProfileCard {data} />
</div>
