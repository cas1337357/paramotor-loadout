/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rpg-gold': '#d4af37',
        'rpg-parchment': '#f4e4bc',
        'rpg-void': '#020617',
      },
      fontFamily: {
        'medieval': ['MedievalSharp', 'cursive'],
        'serif': ['Crimson Text', 'serif'],
      },
    },
  },
  plugins: [],
}