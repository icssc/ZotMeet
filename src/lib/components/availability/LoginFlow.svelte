<script lang="ts">
  import { superForm } from "sveltekit-superforms/client";

  import { userSchema } from "$lib/config/zod-schemas";
  import BrightnessAlert from "~icons/material-symbols/brightness-alert-outline-rounded";
  import EmailIcon from "~icons/mdi/email";
  import KeyIcon from "~icons/mdi/key";
  import UserIcon from "~icons/mdi/user";
  import Loader from "~icons/mdi/loading";

  export let data;

  const loginSchema = userSchema.pick({ email: true, password: true });
  const { form, errors, enhance, delayed } = superForm(data.form, {
    taintedMessage: null,
    validators: loginSchema,
    delayMs: 0,
  });
</script>

<dialog id="auth_modal" class="modal">
  <div class="modal-box min-w-fit">
    <div class="flex h-full w-full">
      <div class="card grid min-h-full w-[50%] rounded-box align-top">
        <div class="modal-action mt-0 flex flex-col justify-start gap-y-6">
          <h3 class="h-fit px-2 text-left text-xl font-bold">Login</h3>

          <form method="POST" action="/auth/login" use:enhance>
            {#if $errors._errors}
              <aside class="variant-filled-error alert mt-6">
                <div><BrightnessAlert /></div>

                <!-- Message -->
                <div class="alert-message">
                  <h3 class="h3">Login Problem</h3>
                  <p>{$errors._errors}</p>
                </div>
              </aside>
            {/if}

            <div class="flex flex-col gap-y-4">
              <label class="input input-bordered flex items-center gap-2">
                <EmailIcon class="text-slate-medium" />
                <input
                  type="text"
                  class="grow appearance-none border-none focus:border-none focus:outline-none focus:ring-0"
                  placeholder="email"
                  autocomplete="email"
                  data-invalid={$errors.email}
                  bind:value={$form.email}
                  class:input-error={$errors.email}
                />
              </label>

              <label class="input input-bordered flex items-center gap-2">
                <KeyIcon class="text-slate-medium" />
                <input
                  type="password"
                  class="grow appearance-none border-none focus:border-none focus:outline-none focus:ring-0"
                  placeholder="password"
                  data-invalid={$errors.password}
                  bind:value={$form.password}
                  class:input-error={$errors.password}
                />
              </label>

              <button type="submit" class="variant-filled-primary btn h-10 w-full">
                {#if $delayed}
                  <Loader class="animate-spin" />
                {:else}
                  Login
                {/if}
              </button>
            </div>

            <!-- <form method="dialog">
              if there is a button in form, it will close the modal
              <button class="btn">Close</button>
            </form> -->
          </form>
        </div>
      </div>

      <div class="divider divider-horizontal">OR</div>

      <div class="card grid min-h-full w-[50%] rounded-box align-top">
        <div class="modal-action mt-0 flex h-full flex-col justify-start gap-y-6">
          <h3 class="h-fit px-2 text-left text-xl font-bold">Save as Guest</h3>

          <form method="POST" action="/auth/login" use:enhance class="min-h-full">
            {#if $errors._errors}
              <aside class="variant-filled-error alert mt-6">
                <div><BrightnessAlert /></div>

                <!-- Message -->
                <div class="alert-message">
                  <h3 class="h3">Login Problem</h3>
                  <p>{$errors._errors}</p>
                </div>
              </aside>
            {/if}

            <div class="mt-auto flex flex-col gap-y-4">
              <label class="input input-bordered flex items-center gap-2">
                <UserIcon class="text-slate-medium" />
                <input
                  type="text"
                  class="grow appearance-none border-none focus:border-none focus:outline-none focus:ring-0"
                  placeholder="username"
                />
              </label>

              <button type="submit" class="variant-filled-primary btn h-10 w-full">
                {#if $delayed}
                  <Loader class="animate-spin" />
                {:else}
                  Save
                {/if}
              </button>
            </div>

            <!-- <form method="dialog">
            if there is a button in form, it will close the modal
            <button class="btn">Close</button>
          </form> -->
          </form>
        </div>
      </div>
    </div>
  </div>
</dialog>
