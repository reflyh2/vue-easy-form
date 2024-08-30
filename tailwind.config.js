/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./dist/**/*.{js,css}"
  ],
  theme: {
    extend: {
      colors: {
        main: colors.teal,
      }
    },
  },
  plugins: [],
}