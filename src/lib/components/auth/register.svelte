<script lang="ts">
  import { superForm } from "sveltekit-superforms/client";

  import { userSchema } from "$lib/config/zod-schemas";
  import Loader from "~icons/mdi/loading";

  export let data;

  const registerSchema = userSchema.pick({
    username: true,
    email: true,
    password: true,
  });

  const { form, errors, enhance, delayed } = superForm(data.form, {
    taintedMessage: null,
    validators: registerSchema,
    delayMs: 0,
  });

  let termsAccept = false;
</script>

<form method="POST" action="/auth/register" use:enhance>
  <!--<SuperDebug data={$form} />-->
  <div class="mt-6">
    <label class="label">
      <span class="sr-only">Username</span>
      <input
        id="username"
        name="username"
        type="text"
        placeholder="username"
        autocomplete="username"
        data-invalid={$errors.username}
        bind:value={$form.username}
        class="input"
        class:input-error={$errors.username}
      />
      {#if $errors.username}
        <small>{$errors.username}</small>
      {/if}
    </label>
  </div>

  <div class="mt-6">
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
  </div>

  <div class="mt-6">
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
    <label for="terms" class="label">
      <input id="terms" name="terms" type="checkbox" class="checkbox" bind:checked={termsAccept} />
      <span class="ml-2">
        I accept the
        <a href="/terms" class="text-primaryHover underline">terms</a>
        and
        <a href="/privacy" class="text-primaryHover underline">privacy policy</a>
        <!--{#if $errors.terms}
					<small>{$errors.terms}</small>
				{/if}-->
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
