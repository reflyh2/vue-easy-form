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
        ...colors,
        main: colors.teal,
      }
    },
  },
  safelist: [
    {
      pattern: /(bg|text|border|ring)-(white|black|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(100|200|300|400|500|600|700|800|900)/,
    },
  ],
  plugins: [],
}