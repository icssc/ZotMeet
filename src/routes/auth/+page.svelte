<script lang="ts">
  import { TabGroup, Tab } from "@skeletonlabs/skeleton";

  import Login from "$lib/components/auth/login.svelte";
  import Register from "$lib/components/auth/register.svelte";

  export let data;

  let tabSet: string = "signIn";
</script>

<div class="mt-48 flex min-h-[100vh] justify-center">
  <div class="mx-2 w-[450px] md:mx-16">
    <TabGroup justify="justify-center">
      <Tab bind:group={tabSet} name="signInTab" value={"signIn"}>Sign In</Tab>
      <Tab bind:group={tabSet} name="signUpTab" value={"signUp"}>Sign Up</Tab>
      <!-- Tab Panels --->
      <svelte:fragment slot="panel">
        {#if tabSet === "signIn"}
          <Login {data} />
        {:else if tabSet === "signUp"}
          <Register {data} />
        {/if}
      </svelte:fragment>
    </TabGroup>
  </div>
</div>
