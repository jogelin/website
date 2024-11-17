const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'selector',
  theme: {
    container: {
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '8rem',
        xl: '12rem',
        '2xl': '15rem',
      },
    },
    extend: {
      boxShadow: {
        around: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
      },
      textColor: {
        primary: {
          DEFAULT: colors.green[700],
          dark: colors.green[500],
        },
        secondary: {
          DEFAULT: colors.slate[500],
          dark: colors.slate[400],
        },
      },
      // Border colors
      borderColor: {
        primary: {
          DEFAULT: colors.green[700],
          dark: colors.green[500],
        },
      },
      // Text decoration colors
      textDecorationColor: {
        primary: {
          DEFAULT: colors.green[700],
          dark: colors.green[500],
        },
      },
    },
  },
  plugins: [
    // Plugin for the curved underline
    function ({ addComponents }) {
      addComponents({
        '.curved-underline': {
          position: 'relative',
          '&:after': {
            content: '""',
            position: 'absolute',
            left: '0',
            width: '100%',
            bottom: '-20px',
            borderTopWidth: '4px',
            borderRadius: '80%',
            height: '20px',
            borderColor: 'rgb(21 128 61)',
            '.dark &': {
              borderColor: 'rgb(34 197 94)',
            },
          },
        },
        '.curved-underline-slim': {
          position: 'relative',
          '&:after': {
            content: '""',
            position: 'absolute',
            left: '0',
            width: '100%',
            bottom: '-20px',
            borderTopWidth: '2px',
            borderRadius: '80%',
            height: '20px',
            borderColor: 'rgb(21 128 61)',
            '.dark &': {
              borderColor: 'rgb(34 197 94)',
            },
          },
        },
      });
    },
  ],
};
