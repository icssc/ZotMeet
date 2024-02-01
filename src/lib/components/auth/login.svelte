<script lang="ts">
  import { superForm } from "sveltekit-superforms/client";

  import { userSchema } from "$lib/config/zod-schemas";
  import BrightnessAlert from "~icons/material-symbols/brightness-alert-outline-rounded";
  import Loader from "~icons/mdi/loading";

  export let data;
  const loginSchema = userSchema.pick({ email: true, password: true });
  const { form, errors, enhance, delayed } = superForm(data.form, {
    taintedMessage: null,
    validators: loginSchema,
    delayMs: 0,
  });
</script>

<form method="POST" action="/auth/login" use:enhance>
  {#if $errors._errors}
    <aside class="alert variant-filled-error mt-6">
      <div><BrightnessAlert /></div>

      <!-- Message -->
      <div class="alert-message">
        <h3 class="h3">Login Problem</h3>
        <p>{$errors._errors}</p>
      </div>
    </aside>
  {/if}

  <div class="mb-4">
    <a href="/auth/login/google" class="rounded-md bg-blue-500 p-2">Sign in with Google</a>
  </div>

  <div class="flex flex-col gap-y-4">
    <label class="label">
      <span class="sr-only">Email</span>
      <input
        id="email"
        name="email"
        type="email"
        placeholder="email"
        autocomplete="email"
        data-invalid={$errors.email}
        bind:value={$form.email}
        class="input"
        class:input-error={$errors.email}
      />
      {#if $errors.email}
        <small>{$errors.email}</small>
      {/if}
    </label>

    <label class="label">
      <span class="sr-only">Password</span>
      <input
        id="password"
        name="password"
        type="password"
        placeholder="password"
        data-invalid={$errors.password}
        bind:value={$form.password}
        class="input"
        class:input-error={$errors.password}
      />
      {#if $errors.password}
        <small>{$errors.password}</small>
      {/if}
    </label>
  </div>

  <div class="mt-6">
    <button type="submit" class="variant-filled-primary btn h-10 w-full">
      {#if $delayed}
        <Loader class="animate-spin" />
      {:else}
        Login
      {/if}
    </button>
  </div>

  <div class="mt-10 flex flex-row items-center justify-center">
    <a href="/auth/password/reset" class="font-semibold underline">{"Forgot Password?"}</a>
  </div>
</form>
