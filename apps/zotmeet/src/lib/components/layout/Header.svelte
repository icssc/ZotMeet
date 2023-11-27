<script lang="ts">
  import { AppBar, Avatar, LightSwitch, popup, type PopupSettings } from '@skeletonlabs/skeleton'

  import { page } from '$app/stores'
  import logo from '$lib/assets/logo.png'
  import BookIcon from '~icons/material-symbols/book'
  import LoginIcon from '~icons/material-symbols/login'
  import LogoutIcon from '~icons/material-symbols/logout'

  const popupTarget = 'profile-popup'

  const popupProfile: PopupSettings = {
    event: 'click',
    target: popupTarget,
    placement: 'top',
  }
</script>

<AppBar>
  <svelte:fragment slot="lead">
    <div class="flex items-center">
      <a href="/" class="btn variant-soft flex items-center gap-1">
        <span class="btn-icon btn-xl overflow-hidden">
          <img src={logo} alt="ZotMeet Logo" class="h-12 w-12" />
        </span>
        <h1 class="text-4xl font-bold">ZotMeet</h1>
      </a>
    </div>
  </svelte:fragment>

  <nav class="hidden md:block">
    <ul class="flex flex-row gap-2 justify-center items-center">
      <li class="btn hover:variant-soft-primary text-lg">
        <a href="/">Home</a>
      </li>
      <li class="btn hover:variant-soft-primary text-lg">
        <a href="/about">About</a>
      </li>
      <li class="btn hover:variant-soft-primary text-lg">
        <a href="/requirements">Requirements</a>
      </li>
    </ul>
  </nav>

  <svelte:fragment slot="trail">
    {#if $page.data.session?.user}
      <div class="flex items-center gap-4">
        <LightSwitch />
        <button class="btn btn-sm" use:popup={popupProfile}>
          <Avatar src={$page.data.session.user.image ?? 'User'} width="w-12" />
        </button>
      </div>
    {:else}
      <a href="/auth/login" class="btn variant-filled">
        <LoginIcon class="w-6 h-6" />
        <span>Login</span>
      </a>
      <LightSwitch />
    {/if}
  </svelte:fragment>
</AppBar>

<div class="card p-4" data-popup={popupTarget}>
  <nav class="list-nav space-y-4">
    <div>
      <h2 class="text-xl font-semibold truncate">
        {$page.data.session?.user?.name}
      </h2>
    </div>

    <hr class="!border-t-4" />

    <ul>
      <li>
        <a href="/profile/{$page.data.session?.user?.id}" class="w-full flex justify-between">
          <span>Reservations</span>
          <span class="badge bg-primary-500">
            <BookIcon class="w-6 h-6" />
          </span>
        </a>
      </li>

      <li>
        <form action="/auth/logout" method="POST">
          <button type="submit" class="w-full flex justify-between">
            <span>Logout</span>
            <span class="badge bg-primary-500">
              <LogoutIcon class="w-6 h-6" />
            </span>
          </button>
        </form>
      </li>
    </ul>
  </nav>
</div>
