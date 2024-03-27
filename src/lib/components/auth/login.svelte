<script lang="ts">
  import { superForm } from "sveltekit-superforms/client";

  import { goto } from "$app/navigation";
  import { userSchema } from "$lib/config/zod-schemas";
  import BrightnessAlert from "~icons/material-symbols/brightness-alert-outline-rounded";
  import EmailIcon from "~icons/mdi/email";
  import Loader from "~icons/mdi/loading";
  import PasswordIcon from "~icons/mdi/password";

  export let data;

  const loginSchema = userSchema.pick({ email: true, password: true });
  const { form, errors, enhance, delayed } = superForm(data.form, {
    taintedMessage: null,
    validators: loginSchema,
    delayMs: 0,
    warnings: { noValidationAndConstraints: false },
    onUpdated({ form }) {
      if (form.valid) {
        goto("/");
      }
    },
  });
</script>

<form method="POST" action="/auth/login" use:enhance>
  {#if $errors._errors}
    <aside class="alert mb-4 mt-6 flex flex-row rounded-md">
      <BrightnessAlert />

      <div class="text-left">
        <h3 class="h3">Login Problem</h3>
        <p>{$errors._errors}</p>
      </div>
    </aside>
  {/if}

  <div class="flex flex-col gap-y-2">
    <label class="input input-bordered flex items-center gap-2">
      <EmailIcon />
      <input
        id="email"
        name="email"
        type="email"
        placeholder="email"
        autocomplete="email"
        data-invalid={$errors.email}
        bind:value={$form.email}
        class="input w-full border-none focus:ring-0"
        class:input-error={$errors.email}
      />
    </label>
    {#if $errors.email}
      <small>{$errors.email}</small>
    {/if}

    <label class="input input-bordered flex items-center gap-2">
      <PasswordIcon />
      <input
        id="password"
        name="password"
        type="password"
        placeholder="password"
        data-invalid={$errors.password}
        bind:value={$form.password}
        class="input w-full border-none focus:ring-0"
        class:input-error={$errors.password}
      />
    </label>

    {#if $errors.password}
      <small>{$errors.password}</small>
    {/if}
  </div>

  <div class="mt-6">
    <button type="submit" class="btn btn-primary h-10 w-full text-white">
      {#if $delayed}
        <Loader class="animate-spin" />
      {:else}
        Login
      {/if}
    </button>
  </div>
</form>
