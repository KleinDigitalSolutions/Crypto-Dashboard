/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0b1120',
        surface: '#111c2e',
        accent: '#38bdf8',
      },
    },
  },
  plugins: [],
}
