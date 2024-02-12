<script lang="ts">
  import AddBoxOutlineRounded from "~icons/material-symbols/add-box-outline-rounded";
  import SettingsOutline from "~icons/material-symbols/settings-outline";
</script>

<div class="flex min-h-full w-[300px] flex-col pb-6 pr-3">
  <div class="flex items-center space-x-4">
    <div class="h-10 w-10 rounded-lg border-4 border-black bg-primary" />
    <h1 class="font-montserrat text-4xl font-semibold text-gray-dark">ZotMeet</h1>
  </div>

  <div class="divider my-2" />

  <div class="space-y-2 px-2">
    <a href="/">
      <button
        class="btn h-12 w-full justify-start space-x-3 bg-white text-lg font-normal shadow-none"
      >
        <AddBoxOutlineRounded class="h-7 w-7" />
        <p>New Meeting</p>
      </button>
    </a>

    <a href="/summary">
      <button
        class="btn h-12 w-full justify-start space-x-3 border-none bg-transparent text-lg font-normal shadow-none"
      >
        <AddBoxOutlineRounded class="h-7 w-7" />
        <p>Summary</p>
      </button>
    </a>

    <a href="/settings">
      <button
        class="btn h-12 w-full justify-start space-x-3 border-none bg-transparent text-lg font-normal shadow-none"
      >
        <SettingsOutline class="h-7 w-7" />
        <p>Settings</p>
      </button>
    </a>
  </div>

  <div class="h-18 card mt-auto rounded-lg border bg-white">
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
        <h2 class="card-title text-base font-medium text-gray-dark">Catherine Sullivan</h2>
        <p class="text-gray-medium">email123@uci.edu</p>
      </div>
    </div>
  </div>
</div>
