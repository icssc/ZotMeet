<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;
  $: ({ group } = data);
</script>

<form action="?/updateGroup" method="POST">
  <h3>Editing: {group.name}</h3>

  <input type="text" id="name" name="name" value={group.name} />
  <input type="text" id="description" name="description" value={group.description} />

  <button type="submit">Update Group</button>
</form>
