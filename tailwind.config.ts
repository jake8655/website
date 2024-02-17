import { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        geist: ['Geist', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#6d9aee',
          light: '#b0c4de',
          dark: '#005cb8',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
