/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: "#DDF4E7",
          green: "#67C090",
          teal: "#26667F",
          dark: "#124170",
        },
      },
    },
  },
  plugins: [],
};
