<script lang="ts">
  import AddBoxOutlineRounded from "~icons/material-symbols/add-box-outline-rounded";
  import CalendarIcon from "~icons/material-symbols/calendar-clock";
  import CloseIcon from "~icons/material-symbols/close";
  import MenuIcon from "~icons/material-symbols/menu";
  import SettingsOutline from "~icons/material-symbols/settings-outline";
</script>

<div class="drawer drawer-end md:hidden">
  <input id="my-drawer" type="checkbox" class="drawer-toggle" checked={true} />
  <div class="drawer-content flex flex-col">
    <div class="navbar bg-gray-light px-5 py-4 md:hidden">
      <div class="flex flex-grow">
        <a href="/" class="flex items-center space-x-4">
          <div class="h-8 w-8 rounded-lg border-2 border-black bg-primary" />
          <h1 class="font-montserrat text-3xl font-semibold text-gray-dark">ZotMeet</h1>
        </a>
      </div>

      <div class="flex-none">
        <label class="btn btn-square btn-ghost" for="my-drawer">
          <MenuIcon class="h-8 w-8" />
        </label>
      </div>
    </div>
  </div>

  <div class="drawer-side z-50">
    <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>

    <div class="flex h-full w-[80%] flex-col bg-slate-100 sm:w-[60%]">
      <div class="flex h-20 items-center justify-end px-5 py-4">
        <label class="btn btn-square btn-ghost" for="my-drawer">
          <CloseIcon class="h-8 w-8" />
        </label>
      </div>

      <div class="flex flex-col gap-y-2 border-t-2 pl-8 pt-6 text-gray-600">
        <a href="/">
          <button
            class="btn h-12 w-full justify-start space-x-3 border-none bg-transparent text-xl font-normal shadow-none"
          >
            <AddBoxOutlineRounded class="h-7 w-7" />
            <p>New Meeting</p>
          </button>
        </a>
        <a href="/summary">
          <button
            class="btn h-12 w-full justify-start space-x-3 border-none bg-transparent text-xl font-normal shadow-none"
          >
            <CalendarIcon class="h-7 w-7" />
            <p>Summary</p>
          </button>
        </a>
        <a href="/settings">
          <button
            class="btn h-12 w-full justify-start space-x-3 border-none bg-transparent text-xl font-normal shadow-none"
          >
            <SettingsOutline class="h-7 w-7" />
            <p>Settings</p>
          </button>
        </a>
      </div>

      <div class="h-18 card mx-4 mb-6 mt-auto rounded-lg border bg-white">
        <div class="card-body flex flex-row gap-x-3 px-4 py-3">
          <div class="avatar">
            <div class="w-12 rounded-full">
              <img
                src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                alt="daisy"
              />
            </div>
          </div>
          <div class="gap-y-0">
            <h2 class="card-title line-clamp-1 text-base font-medium text-gray-dark">
              Catherine Sullivan
            </h2>
            <p class="line-clamp-1 text-gray-medium">email123@uci.edu</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
