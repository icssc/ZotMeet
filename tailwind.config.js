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
      colors: {
        gray: {
          light: "#F3F4F6" /* maps to gray-100 */,
          base: "#D1D5DB" /* gray-300 */,
          medium: "#9CA3AF" /* gray-400 */,
          dark: "#1F2937" /* gray-800 */,
        },
        slate: {
          base: "#CBD5E1" /* slate-300 */,
        },
      },
    },
    default: "daisy",
  },
  daisyui: {
    themes: [
      "emerald",
      {
        emerald: {
          ...emerald["emerald"],
          primary: "#367BFB",
          secondary: "#65CC8A",
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
