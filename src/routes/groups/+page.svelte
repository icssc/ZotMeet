<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;

  $: ({ groups } = data);
</script>

<main>
  <div>
    <form action="?/createGroup" method="POST">
      <div>Add Group</div>

      <input type="text" name="name" id="name" placeholder="name" />
      <input type="text" name="description" id="description" placeholder="description" />

      <button type="submit">Submit</button>
    </form>

    <h2>Your groups:</h2>
    {#each groups as group}
      <div>
        <header>name: {group.name}</header>
        <p>
          description: {group.description}
        </p>
        <form action="?/deleteGroup&id={group.id}" method="POST">
          <button type="submit" class="secondary outline">Delete Group</button>
        </form>
      </div>
    {/each}
  </div>
</main>
