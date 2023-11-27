<script lang="ts">
  import GitHubIcon from '~icons/devicon/github'
  import GoogleIcon from '~icons/devicon/google'
</script>

<div class="flex px-8 py-16 items-center justify-center h-full">
  <div class="card p-8 shadow-xl mx-auto max-w-4xl border">
    <div class="space-y-8">
      <div>
        <h2 class="text-4xl md:text-6xl font-bold">Sign in</h2>
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

      <div class="space-y-4">
        <label class="space-y-2">
          <span>Email Address</span>
          <input type="text" class="input w-full" />
        </label>
        <button class="btn variant-filled-primary w-full">Continue</button>
      </div>

      <div class="space-x-1">
        <span>No account?</span>
        <a href="/auth/signup" class="text-primary-500 hover:underline">Sign up</a>
      </div>
    </div>
  </div>
</div>
