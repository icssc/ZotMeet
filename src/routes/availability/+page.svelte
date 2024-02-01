<script lang="ts">
  import { Tab, TabGroup } from "@skeletonlabs/skeleton";

  import { PersonalAvailability } from "$lib/components/availability";
  import { meetingName } from "$lib/stores/meetingSetupStores";

  let currentTab: number = 0;
</script>

<main class="h-full min-h-screen w-full bg-surface-100">
  <div class="mx-auto flex max-w-xl justify-center bg-surface-50 p-5 align-bottom">
    <h1 class="text-center text-2xl font-extrabold">{$meetingName}</h1>
  </div>
  <section class="mx-auto max-w-xl bg-surface-50 px-5 py-2">
    <div class="flex justify-center gap-2 pb-2">
      <TabGroup justify="justify-center">
        <Tab bind:group={currentTab} name="tab1" value={0}>My Availability</Tab>
        <Tab bind:group={currentTab} name="tab2" value={1}>Group Availability</Tab>
        <svelte:fragment slot="panel">
          {#if currentTab === 0}
            <PersonalAvailability />
          {:else if currentTab === 1}
            <div><p>Group Availability</p></div>
          {/if}
        </svelte:fragment>
      </TabGroup>
    </div>
  </section>
</main>
