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
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.text-primary': {
          color: colors.green[700],
          '.dark &': {
            color: colors.green[500],
          },
        },
        '.text-secondary': {
          color: colors.slate[500],
          '.dark &': {
            color: colors.slate[400],
          },
        },
        '.border-primary': {
          borderColor: colors.green[700],
          '.dark &': {
            borderColor: colors.green[500],
          },
        },
        '.bg-primary': {
          backgroundColor: colors.green[700],
          '.dark &': {
            backgroundColor: colors.green[500],
          },
        },
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
            borderColor: colors.green[700],
            '.dark &': {
              borderColor: colors.green[500],
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
            borderColor: colors.green[700],
            '.dark &': {
              borderColor: colors.green[500],
            },
          },
        },
        '.link-primary': {
          color: colors.slate[500],
          textDecorationColor: colors.green[700],
          '&:hover, &.active': {
            color: colors.green[700],
            textDecoration: 'underline',
            textDecorationThickness: '1px',
            textUnderlineOffset: '2px',
          },
          '.dark &': {
            textDecorationColor: colors.green[500],
            '&:hover, &.active': {
              color: colors.green[500],
            },
          },
        },
      });
    },
  ],
};
