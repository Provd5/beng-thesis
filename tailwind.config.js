/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontSize: {
        xs: ["12px", "14px"],
        sm: ["14px", "16px"],
        base: ["16px", "18px"],
        md: ["18px", "20px"],
        lg: ["20px", "28px"],
        xl: ["24px", "32px"],
      },
      dropShadow: {
        light: "0 0 1px rgb(var(--white-light) / 1)",
        dark: "0 0 1px rgb(var(--black-dark) / 1)",
      },
      borderRadius: {
        md: "12px",
        lg: "14px",
        xl: "18px",
        "2xl": "24px",
        "3xl": "32px",
      },
      backgroundImage: {
        "gradient-light": "var(--gradient-light)",
        "gradient-dark": "var(--gradient-dark)",
      },
      colors: {
        transparent: "transparent",
        current: "currentColor",
        white: {
          light: "rgb(var(--white-light))",
          DEFAULT: "rgb(var(--white-default))",
          dark: "rgb(var(--white-dark))",
        },
        black: {
          light: "rgb(var(--black-light))",
          DEFAULT: "rgb(var(--black-default))",
          dark: "rgb(var(--black-dark))",
        },
        primary: {
          light: "rgb(var(--primary-light))",
          DEFAULT: "rgb(var(--primary-default))",
          dark: "rgb(var(--primary-dark))",
        },
        secondary: {
          light: "rgb(var(--secondary-light))",
          DEFAULT: "rgb(var(--secondary-default))",
          dark: "rgb(var(--secondary-dark))",
        },
        green: {
          DEFAULT: "rgb(var(--green-default))",
        },
        red: {
          DEFAULT: "rgb(var(--red-default))",
        },
        blue: {
          DEFAULT: "rgb(var(--blue-default))",
        },
        yellow: {
          DEFAULT: "rgb(var(--yellow-default))",
        },
        pink: {
          DEFAULT: "rgb(var(--pink-default))",
        },
        gray: {
          DEFAULT: "rgb(var(--gray-default))",
        },
      },
    },
  },
  plugins: [],
};
