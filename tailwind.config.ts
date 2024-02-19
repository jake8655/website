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
      keyframes: {
        bounce: {
          '0%, 100%': {
            transform: 'none',
            animationTimingFunction: 'cubic-bezier(0,0,0.2,1)',
          },
          '50%': {
            transform: 'translateY(-25%)',
            animationTimingFunction: 'cubic-bezier(0.8,0,1,1)',
          },
        },
      },
      boxShadow: {
        glow: '0 0 50px 0 rgba(109, 154, 238, 0.3)',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('tailwind-scrollbar-hide')],
} satisfies Config;
