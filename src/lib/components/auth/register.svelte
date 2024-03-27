<script lang="ts">
  import { superForm } from "sveltekit-superforms/client";

  import { goto } from "$app/navigation";
  import { userSchema } from "$lib/config/zod-schemas";
  import EmailIcon from "~icons/mdi/email";
  import Loader from "~icons/mdi/loading";
  import PasswordIcon from "~icons/mdi/password";
  import UserIcon from "~icons/mdi/user";

  export let data;

  const registerSchema = userSchema.pick({
    displayName: true,
    email: true,
    password: true,
  });

  const { form, errors, enhance, delayed } = superForm(data.form, {
    taintedMessage: null,
    validators: registerSchema,
    delayMs: 0,
    warnings: { noValidationAndConstraints: false },
    onUpdated({ form }) {
      if (form.valid) {
        goto("/");
      }
    },
  });

  let termsAccept = false;
</script>

<form method="POST" action="/auth/register" use:enhance>
  <div class="flex flex-col gap-y-2">
    <div>
      <label class="input input-bordered flex items-center gap-2">
        <UserIcon />
        <input
          id="displayName"
          name="displayName"
          type="text"
          placeholder="display name"
          data-invalid={$errors.displayName}
          bind:value={$form.displayName}
          class="input w-full border-none focus:ring-0"
          class:input-error={$errors.displayName}
        />
      </label>
      {#if $errors.displayName}
        <small>{$errors.displayName}</small>
      {/if}
    </div>

    <div>
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
    </div>

    <div>
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

    <label for="terms" class="label justify-normal">
      <input id="terms" name="terms" type="checkbox" class="checkbox" bind:checked={termsAccept} />
      <span class="ml-2">
        I accept the
        <a href="/terms" class="text-primaryHover underline">terms</a>
        and
        <a href="/privacy" class="text-primaryHover underline">privacy policy</a>
      </span>
    </label>
  </div>

  <div class="mt-6">
    <button type="submit" disabled={!termsAccept} class="variant-filled-primary btn h-10 w-full">
      {#if $delayed}
        <Loader class="animate-spin" />
      {:else}
        Register
      {/if}</button
    >
  </div>
</form>
