<script lang="ts">
  import { TabGroup, Tab } from "@skeletonlabs/skeleton";

  import Login from "$lib/components/auth/login.svelte";
  import Register from "$lib/components/auth/register.svelte";

  export let data;

  let tabSet: string = "signIn";
</script>

<div class="flex grow justify-center bg-blue-200 pt-48">
  <div class="mx-2 w-[450px] md:mx-16">
    <!-- <div class="mb-4">
      <a
        href="/auth/login/google"
        class="mx-auto flex w-fit rounded-md bg-blue-500 p-2 font-semibold text-white"
      >
        Continue with Google
      </a>
    </div> -->

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
