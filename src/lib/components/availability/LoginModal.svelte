<script lang="ts">
  import { superForm } from "sveltekit-superforms/client";

  import { guestSchema, userSchema } from "$lib/config/zod-schemas";
  import BrightnessAlert from "~icons/material-symbols/brightness-alert-outline-rounded";
  import EmailIcon from "~icons/mdi/email";
  import KeyIcon from "~icons/mdi/key";
  import Loader from "~icons/mdi/loading";
  import UserIcon from "~icons/mdi/user";

  import type { SuperValidated, ZodValidation } from "sveltekit-superforms";
  import type { AnyZodObject } from "zod";
  import { isEditingAvailability, isStateUnsaved } from "$lib/stores/availabilityStores";

  export let data: {
    user: Lucia.UserAttributes;
    form: SuperValidated<ZodValidation<AnyZodObject>>;
    guestForm: SuperValidated<ZodValidation<AnyZodObject>>;
  };

  const loginSchema = userSchema.pick({ email: true, password: true });
  const guestLoginSchema = guestSchema.pick({ username: true });
  const { form, errors, enhance, delayed } = superForm(data.form, {
    taintedMessage: null,
    validators: loginSchema,
    delayMs: 0,
    onUpdated({ form }) {
      if (form.valid && data.user) {
        const authModal = document.getElementById("auth-modal") as HTMLDialogElement;
        if (authModal) {
          authModal.close();
        }

        $isEditingAvailability = false;
        $isStateUnsaved = false;
        // TODO: Update DB with data
      }
    },
  });

  const {
    form: guestForm,
    errors: guestErrors,
    enhance: guestEnhance,
    delayed: guestDelayed,
  } = superForm(data.guestForm, {
    taintedMessage: null,
    validators: guestLoginSchema,
    delayMs: 0,
    onUpdated({ form }) {
      if (form.valid) {
        const authModal = document.getElementById("auth-modal") as HTMLDialogElement;
        if (authModal) {
          authModal.close();
        }

        $isEditingAvailability = false;
        $isStateUnsaved = false;

        // TODO: Update DB with guest data
      }
    },
  });
</script>

<dialog id="auth-modal" class="modal">
  <div class="modal-box min-w-fit">
    <form method="dialog">
      <button class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
    </form>

    <div class="flex h-full w-full flex-col md:flex-row">
      <div class="card grid rounded-box align-top md:w-[50%]">
        <div class="modal-action mt-0 flex flex-col justify-start gap-y-6">
          <h3 class="h-fit px-2 text-left text-xl font-bold">Login</h3>

          <form
            method="POST"
            action="/auth/login"
            use:enhance
            class="flex-center w-full grow flex-col items-center space-y-4 md:w-[250px]"
          >
            {#if $errors._errors}
              <aside class="variant-filled-error alert">
                <div><BrightnessAlert /></div>

                <!-- Message -->
                <div class="alert-message">
                  <h3 class="h3">Login Problem</h3>
                  <p>{$errors._errors}</p>
                </div>
              </aside>
            {/if}

            <div class="flex w-full flex-col gap-y-4">
              <label class="input input-bordered flex items-center gap-2">
                <EmailIcon class="text-slate-medium" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  class="grow appearance-none border-none focus:border-none focus:outline-none focus:ring-0"
                  placeholder="email"
                  autocomplete="email"
                  data-invalid={$errors.email}
                  bind:value={$form.email}
                  class:input-error={$errors.email}
                />
              </label>
              {#if $errors.email}
                <small>{$errors.email}</small>
              {/if}

              <label class="input input-bordered flex items-center gap-2">
                <KeyIcon class="text-slate-medium" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  class="grow appearance-none border-none focus:border-none focus:outline-none focus:ring-0"
                  placeholder="password"
                  data-invalid={$errors.password}
                  bind:value={$form.password}
                  class:input-error={$errors.password}
                />
              </label>
              {#if $errors.password}
                <small>{$errors.password}</small>
              {/if}

              <button type="submit" class="variant-filled-primary btn h-10 w-full">
                {#if $delayed}
                  <Loader class="animate-spin" />
                {:else}
                  Login
                {/if}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="divider md:divider-horizontal">OR</div>

      <div class="card grid rounded-box align-top md:w-[50%]">
        <div class="modal-action mt-0 flex flex-col justify-start gap-y-6">
          <h3 class="h-fit px-2 text-left text-xl font-bold">Save as Guest</h3>

          <form
            method="POST"
            action="TODO"
            use:guestEnhance
            class="flex-center w-full grow flex-col items-center space-y-4 md:w-[250px]"
          >
            {#if $guestErrors._errors}
              <aside class="variant-filled-error alert">
                <div><BrightnessAlert /></div>

                <!-- Message -->
                <div class="alert-message">
                  <h3 class="h3">Login Problem</h3>
                  <p>{$guestErrors._errors}</p>
                </div>
              </aside>
            {/if}

            <div class="flex w-full flex-col gap-y-4">
              <label class="input input-bordered flex items-center gap-2">
                <UserIcon class="text-slate-medium" />
                <input
                  type="text"
                  class="grow appearance-none border-none focus:border-none focus:outline-none focus:ring-0"
                  placeholder="username"
                  bind:value={$guestForm.username}
                />
              </label>

              <button type="submit" class="variant-filled-primary btn h-10 w-full">
                {#if $guestDelayed}
                  <Loader class="animate-spin" />
                {:else}
                  Save
                {/if}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- Closes the modal -->
  <form method="dialog" class="modal-backdrop">
    <button />
  </form>
</dialog>
