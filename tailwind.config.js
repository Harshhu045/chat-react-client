/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          600: "#A5A5A5", // Custom gray (this is OK)
          200: "#efefef"
        },
        black:{
          500: "#100c08"
        }

      },
    },
  },
  plugins: [],
};
