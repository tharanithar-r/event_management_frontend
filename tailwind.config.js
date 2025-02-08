/** @type {import('tailwindcss').Config} */

const { heroui } = require("@heroui/react");

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Urbanist: ["Urbanist", "sans-serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      addCommonColors: true,
      themes: {
        dark: {
          colors: {
            warning: {
              50: "#fdffde",
              100: "#f9fcb2",
              200: "#f5fa84",
              300: "#f1f754",
              400: "#edf527",
              500: "#d3dc11",
              600: "#a4ab08",
              700: "#757a02",
              800: "#464900",
              900: "#171900",
              DEFAULT: "#f2f862",
              foreground: "#000000",
            },
            focus: "#f2f862",
          },
        },
      },
    }),
  ],
};
