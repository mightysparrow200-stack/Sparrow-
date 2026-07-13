/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coopGreen: {
          light: '#e8f5ee',
          DEFAULT: '#1a5c38',
          dark: '#0d3d25',
        },
        coopGold: '#f0a500',
      },
    },
  },
  plugins: [],
}
