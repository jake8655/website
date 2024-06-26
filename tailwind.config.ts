import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";
import type { PluginCreator } from "tailwindcss/types/config";

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        geist: ["Geist", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#6d9aee",
          light: "#b0c4de",
          dark: "#005cb8",
        },
      },
      keyframes: {
        bounce: {
          "0%, 100%": {
            transform: "none",
            animationTimingFunction: "cubic-bezier(0,0,0.2,1)",
          },
          "50%": {
            transform: "translateY(-25%)",
            animationTimingFunction: "cubic-bezier(0.8,0,1,1)",
          },
        },
        blink: {
          "0%, 100%": { backgroundColor: "transparent" },
          "50%": { backgroundColor: "currentColor" },
        },
        blinkText: {
          "0%, 100%": { color: "#b0c4de" },
          "50%": { color: colors.gray[900] },
        },
      },
      animation: {
        blink: "blink 1s infinite steps(1, start)",
        blinkText: "blinkText 1s infinite steps(1, start)",
      },
      boxShadow: {
        glow: "0 0 50px 0 rgba(109, 154, 238, 0.3)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("tailwind-scrollbar-hide"),
  ] as PluginCreator[],
} satisfies Config;
