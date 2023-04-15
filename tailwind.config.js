/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        night: "#05050F",
        textBlack: "#04040C",
      },
      backgroundColor: (theme) => ({
        ...theme("colors"),
        dark: "#05050F",
        light: "#ffffff",
      }),
    },
  },
  plugins: [],
};
