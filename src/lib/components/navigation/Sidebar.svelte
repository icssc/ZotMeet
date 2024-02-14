<script lang="ts">
  import LogoArea from "./shared/LogoArea.svelte";
  import NavButtons from "./shared/NavButtons.svelte";
  import ProfileCard from "./shared/ProfileCard.svelte";
</script>

<div class="hidden min-h-full min-w-[250px] flex-col pr-3 md:flex xl:min-w-[300px]">
  <LogoArea />

  <div class="divider my-2" />

  <NavButtons />
  <ProfileCard />
</div>
