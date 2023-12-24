<script lang="ts">
  let email = "";
  let password = "";

  const handleSubmit = () => {
    console.log({ email, password });
  };
</script>

<div class="flex flex-col gap-8 mt-24">
  <a href="/auth/google">
    <div
      class="flex flex-row items-center justify-center gap-2 p-2 text-xl font-semibold border-2 rounded-md hover:shadow-md"
    >
      <img
        src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
        alt="Google Icon"
        class="w-8"
      />
      Sign In With Google
    </div>
  </a>

  <hr class="!border-t-4" />

  <form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-8 text-lg w-96">
    <div class="flex flex-col justify-center w-full gap-4">
      <div>
        <!-- <label for="email">Email:</label> -->
        <input
          type="email"
          id="email"
          bind:value={email}
          required
          class="w-full p-2 bg-transparent border-2 rounded-md border-primary overflow-ellipsis focus:outline-none"
          placeholder="your-email@email.com"
        />
      </div>

      <div>
        <!-- <label for="password">Password:</label> -->
        <input
          type="password"
          id="password"
          bind:value={password}
          required
          class="w-full p-2 bg-transparent border-2 rounded-md border-primary overflow-ellipsis focus:outline-none"
          placeholder="password"
        />
      </div>
    </div>

    <button
      type="submit"
      class="w-full px-5 py-2 mx-auto font-medium border-2 rounded-md bg-primary border-primary hover:shadow-md"
      >Sign In</button
    >
  </form>
</div>
