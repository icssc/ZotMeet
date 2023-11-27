<script lang="ts">
  import GitHubIcon from '~icons/devicon/github'
  import GoogleIcon from '~icons/devicon/google'
</script>

<div class="flex px-8 py-16 items-center justify-center h-full">
  <div class="card p-8 mx-auto max-w-4xl border">
    <div class="space-y-8">
      <div>
        <h2 class="text-4xl md:text-6xl font-bold">Create your account</h2>
        <p class="opacity-80">to continue to ZotMeet</p>
      </div>

      <div class="flex flex-col gap-2">
        <a href="/auth/login/google" class="btn bg-white text-black">
          <GoogleIcon class="h-6 w-6" />
          <span>Continue with Google</span>
        </a>
        <a href="/auth/login/github" class="btn bg-white text-black">
          <GitHubIcon class="h-6 w-6" />
          Continue with GitHub
        </a>
      </div>

      <hr class="!border-t-4" />

      <div class="flex flex-col gap-4">
        <div class="w-full flex gap-2">
          <label class="w-full space-y-2">
            <span>First Name</span>
            <input type="text" class="input input-bordered w-full" />
          </label>

          <label class="w-full space-y-2">
            <span>Last Name</span>
            <input type="text" class="input input-bordered w-full" />
          </label>
        </div>

        <label class="space-y-2">
          <span>Email Address</span>
          <input type="text" class="input input-bordered w-full" />
        </label>

        <label class="space-y-2">
          <span>Password</span>
          <input type="password" class="input input-bordered w-full" />
        </label>

        <button class="btn variant-filled-primary w-full">Continue</button>
      </div>

      <div class="space-x-1">
        <span>Have an account?</span>
        <a href="/auth/login" class="text-primary-500 hover:underline">Log in</a>
      </div>
    </div>
  </div>
</div>
