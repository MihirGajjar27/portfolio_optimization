/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    {
      pattern: /./, // the "." means "everything"
    },
  ],
  theme: {
    extend: {
      maxWidth: {
        '7xl': '1500px',
      },
      borderWidth: {
        '1': '1px',
      },
      borderColor: {
        'primary': '#1B1B1B',
        'secondary': '#353535'
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "blue-gradient": "linear-gradient(to right, #8CA0FA, #D5DBF1)"
      },
      colors: {
        highlight: '#d1daff',

        gray: {
          100: 'hsl(0, 20, 97)',
          200: 'hsl(0, 0, 90)',
          300: 'hsl(0, 0, 80)',
          400: 'hsl(0, 0, 70)',
          500: 'hsl(0, 0, 60)',
          600: 'hsl(0, 0, 50)',
          700: 'hsl(0, 0, 43)',
          800: 'hsl(0, 0, 33)',
          900: 'hsl(0, 0, 28)',
        },

        blue: {
          100: 'hsl(233, 88, 97)',
          200: 'hsl(233, 72, 90)',
          300: 'hsl(233, 71, 76)',
          400: 'hsl(228, 63, 67)',
          500: 'hsl(230, 65, 63)',
          600: 'hsl(230, 52, 53)',
          700: 'hsl(231, 50, 43)',
          800: 'hsl(230, 58, 33)',
          900: 'hsl(230, 56, 27)',
        },

        red: {
          100: 'hsl(0, 67, 94)',
          200: 'hsl(0, 73, 87)',
          300: 'hsl(0, 71, 79)',
          400: 'hsl(359, 64, 72)',
          500: 'hsl(360, 64, 62)',
          600: 'hsl(0, 68, 51)',
          700: 'hsl(0, 69, 31)',
          800: 'hsl(1, 66, 28)',
          900: 'hsl(1, 67, 22)',
        },

        yellow: {
          100: 'hsl(40, 100, 97)',
          200: 'hsl(42, 100, 94)',
          300: 'hsl(43, 100, 91)',
          400: 'hsl(44, 100, 85)',
          500: 'hsl(44, 100, 79)',
          600: 'hsl(43, 100, 66)',
          700: 'hsl(40, 100, 34)',
          800: 'hsl(41, 100, 27)',
          900: 'hsl(44, 100, 20)',
        },

        green: {
          100: 'hsl(144, 71, 93)',
          200: 'hsl(141, 63, 86)',
          300: 'hsl(141, 64, 78)',
          400: 'hsl(142, 64, 71)',
          500: 'hsl(144, 56, 65)',
          600: 'hsl(145, 55, 48)',
          700: 'hsl(144, 64, 27)',
          800: 'hsl(155, 59, 24)',
          900: 'hsl(155, 58, 20)',
        }

      },
      textColor: {
        highlight: 'black',
      },
      keyframes: {
        'arrow-slide': {
          '0%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(150%)' },
          '51%': { transform: 'translateX(-150%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'arrow-slide': 'arrow-slide 0.5s ease-in-out',
      },
      boxShadow: {
        'inner-2xl': 'inset 0 4px 6px rgba(0, 0, 0, 0.2), inset 0 10px 15px rgba(0, 0, 0, 0.05)',
        '1': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        '2': '0 6px 8px -1px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)'
      },
    },
  },
    plugins: [
    plugin(function({ addBase, theme }) {
      addBase({ '::selection': { backgroundColor: theme('colors.highlight'), color: '#000' }});
    }),
  ],
};
