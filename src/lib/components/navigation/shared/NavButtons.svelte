<script lang="ts">
  import type { ComponentType } from "svelte";

  import NavButton from "./NavButton.svelte";

  import AddBoxOutlineIcon from "~icons/material-symbols/add-box-outline";
  import CalendarSearchOutlineIcon from "~icons/mdi/calendar-search-outline";
  // import SettingsOutlineIcon from "~icons/mdi/settings-outline";

  export let handleClick: (() => void) | undefined = undefined;

  interface NavInfo {
    id: number;
    text: string;
    href: string;
    icon: ComponentType;
  }

  const NAV_BUTTONS: NavInfo[] = [
    {
      id: 1,
      text: "New Meeting",
      href: "/",
      icon: AddBoxOutlineIcon,
    },
    {
      id: 2,
      text: "Summary",
      href: "/summary",
      icon: CalendarSearchOutlineIcon,
    },
    // {
    //   id: 3,
    //   text: "Settings",
    //   href: "/settings",
    //   icon: SettingsOutlineIcon,
    // },
  ];
</script>

<div class="flex flex-col gap-y-2 border-t-2 px-6 pt-6 text-gray-600 sm:px-8 md:border-0 md:p-0">
  {#each NAV_BUTTONS as button}
    <NavButton text={button.text} href={button.href} {handleClick}>
      <button.icon class="h-7 w-7" />
    </NavButton>
  {/each}
</div>
