<script lang="ts">
  import type { PageData } from "../../../../routes/$types";

  import { enhance } from "$app/forms";
  import LoginIcon from "~icons/mdi/login";
  import LogoutIcon from "~icons/mdi/logout";

  export let data: PageData;
  export let handleClick: (() => void) | undefined = undefined;

  $: user = data.user;
</script>

<div class="mb-6 mt-auto w-full px-2 md:px-0">
  {#if user}
    <div class="h-18 card rounded-lg border bg-white">
      <div class="card-body flex flex-row gap-x-3 px-4 py-3">
        <div class="avatar">
          <div class="w-12 rounded-full">
            <img
              src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
              alt="daisy"
            />
          </div>
        </div>

        <div class="max-w-full gap-y-0 overflow-hidden break-words">
          <h2 class="card-title line-clamp-1 text-base font-medium text-gray-dark">
            {user.displayName}
          </h2>
          <p class="line-clamp-1 text-gray-medium">{user.email}</p>
        </div>
      </div>
    </div>

    <form use:enhance action="/auth/logout" method="post" class="mt-1 w-full">
      <button
        type="submit"
        class="flex-center btn btn-neutral h-10 min-h-0 w-full"
        on:click={handleClick}
      >
        <LogoutIcon />
        <p>Logout</p>
      </button>
    </form>
  {:else}
    <a href="/auth" class="mb-1 w-full">
      <button
        type="submit"
        class="flex-center btn btn-primary h-10 min-h-0 w-full text-white"
        on:click={handleClick}
      >
        <LoginIcon />
        <p>Login</p>
      </button>
    </a>
  {/if}
</div>
