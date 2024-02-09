// @ts-check
import { join } from "path";

// import { skeleton } from "@skeletonlabs/tw-plugin";
import forms from "@tailwindcss/forms";
import daisyui from "daisyui";
import emerald from "daisyui/src/theming/themes";

// import { zotmeetTheme } from "./theme";

/** @type {import('tailwindcss').Config} */
export default {
  // Opt for dark mode to be handled via the class method
  darkMode: "class",
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    // Append the path to the Skeleton package
    join(require.resolve("@skeletonlabs/skeleton"), "../**/*.{html,js,svelte,ts}"),
  ],
  theme: {
    extend: {
      colors: {},
    },
    default: "daisy",
  },
  daisyui: {
    themes: [
      "emerald",
      {
        emerald: {
          ...emerald["emerald"],
        },
      },
    ],
  },
  plugins: [
    daisyui,
    forms,
    // skeleton({
    //   themes: { custom: [zotmeetTheme] },
    // }),
  ],
};
