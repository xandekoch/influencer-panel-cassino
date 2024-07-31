/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "main-green": "#2AA31F",
        "main-yellow": "#EFB047",
        "main-red": "#F53B30",
        "dark-gray-1": "#0D0F11",
        "dark-gray-2": "#191D23",
        "dark-gray-3": "#262C36",
        "dark-gray-4": "#334E68",
        "dark-gray-5": "#576776",
      }
    },
  },
  plugins: [],
}