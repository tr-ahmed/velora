/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          900: '#0D221A',
          800: '#143529',
          700: '#1E4D3C',
        },
        gold: {
          light: '#EAD096',
          DEFAULT: '#C5A059',
          dark: '#987834',
        }
      },
      fontFamily: {
        sans: ['Cairo', 'Readex Pro', 'sans-serif'],
        serif: ['Cairo', 'Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}
