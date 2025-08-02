/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          blue: '#2C5282',
          gold: '#D69E2E',
        },
        secondary: {
          lightGray: '#F7FAFC',
          white: '#FFFFFF',
        },
        blue: {
          50: '#EBF8FF',
          100: '#BEE3F8',
          200: '#90CDF4',
          300: '#63B3ED',
          400: '#4299E1',
          500: '#3182CE',
          600: '#2C5282',
          700: '#2A4365',
          800: '#1A365D',
          900: '#153E75',
        },
        gold: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#D69E2E',
          600: '#D69E2E',
          700: '#B7791F',
          800: '#975A16',
          900: '#744210',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'custom': '8px',
      },
    },
  },
  plugins: [],
};
