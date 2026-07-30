/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'montessori-noun': '#000000',
        'montessori-verb': '#E74C3C',
        'montessori-adj': '#1B365D',
        'montessori-article': '#87CEEB',
        'montessori-prep': '#2ECC71',
        'montessori-adv': '#F39C12',
        'app-bg': '#111111',
        'app-card': '#1A1A1A',
        'app-border': '#333333',
      }
    },
  },
  plugins: [],
}