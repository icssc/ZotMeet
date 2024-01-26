<script lang="ts">
  import { superForm } from "sveltekit-superforms/client";

  import { userSchema } from "$lib/config/zod-schemas";
  import Loader from "~icons/mdi/loading";

  export let data;

  const registerSchema = userSchema.pick({
    firstName: true,
    lastName: true,
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
      <span class="sr-only">First Name</span>
      <input
        id="firstName"
        name="firstName"
        type="text"
        placeholder="first name"
        autocomplete="given-name"
        data-invalid={$errors.firstName}
        bind:value={$form.firstName}
        class="input"
        class:input-error={$errors.firstName}
      />
      {#if $errors.firstName}
        <small>{$errors.firstName}</small>
      {/if}
    </label>
  </div>

  <div class="mt-6">
    <label class="label">
      <span class="sr-only">Last Name</span>
      <input
        id="lastName"
        name="lastName"
        type="text"
        placeholder="last name"
        autocomplete="family-name"
        data-invalid={$errors.lastName}
        bind:value={$form.lastName}
        class="input"
        class:input-error={$errors.lastName}
      />
      {#if $errors.lastName}
        <small>{$errors.lastName}</small>
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
