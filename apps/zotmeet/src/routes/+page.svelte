<script lang="ts">
  import ArrowCircleRightIcon from '~icons/material-symbols/arrow-circle-right'
</script>

<div class="px-8 py-16 max-w-4xl mx-auto">
  <div class="card">
    <header class="card-header text-4xl text-center font-semibold p-8">
      Coordinating meetings and so much more!
    </header>

    <section class="p-4 flex justify-center gap-8">
      <a href="/auth/login" class="btn variant-filled-primary">
        <ArrowCircleRightIcon class="w-6 h-6" />
        <span>Login with Oauth</span>
      </a>
    </section>

    <footer class="card-footer">
      <div class="p-8">
        <p class="text-4xl text-center font-semibold">Create a Reservation</p>
        <p class="opacity-50 text-lg text-center">Try creating a reservation without logging in.</p>
      </div>

      <form class="space-y-4">
        <div>
          <label class="label text-2xl font-semibold">
            <span>Reservation ID</span>
            <input type="text" class="input" />
          </label>
        </div>

        <div>
          <button class="w-full btn variant-filled-secondary"> Create Reservation </button>
        </div>
      </form>
    </footer>
  </div>
</div>
