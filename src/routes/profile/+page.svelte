<script lang="ts">
  import type { PageData } from "./$types";

  import { enhance } from "$app/forms";

  export let data: PageData;
  $: ({ user } = data);
</script>

<div>
  {#if user}
    <div>
      <p>{user.firstName} {user.lastName}</p>
      <div>
        <form use:enhance action="/auth/logout" method="post">
          <button type="submit" class="btn">
            <span>Logout</span>
          </button>
        </form>
      </div>
    </div>

    <form action="?/updateUser" method="POST">
      <h3>Editing: {user.firstName} {user.lastName} {user.userId}</h3>

      <input type="text" id="firstName" name="firstName" value={user.firstName} />
      <input type="text" id="lastName" name="lastName" value={user.lastName} />

      <button type="submit">Update Profile</button>
    </form>

    <form action="?/deleteUser" method="POST">
      <button type="submit" class="secondary outline">Delete Account</button>
    </form>
  {:else}
    <div>
      <p>You are not signed in. Please sign in.</p>
      <a href="/auth">Sign In</a>
    </div>
  {/if}
</div>
