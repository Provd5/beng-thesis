/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      dropShadow: {
        icon: "0 1px 0px rgba(0, 0, 0, 0.3)",
      },
      colors: {
        transparent: "transparent",
        current: "currentColor",
        colors: {
          text: "rgb(var(--text))",
          background: "rgb(var(--background))",
          primary: "rgb(var(--primary))",
          secondary: "rgb(var(--secondary))",
          accent: "rgb(var(--accent))",

          green: "rgb(var(--green))",
          red: "rgb(var(--red))",
          blue: "rgb(var(--blue))",
          yellow: "rgb(var(--yellow))",
          pink: "rgb(var(--pink))",
          cyan: "rgb(var(--cyan))",
          gray: "rgb(var(--gray))",
        },
      },
    },
  },
  plugins: [],
};
