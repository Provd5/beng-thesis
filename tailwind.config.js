/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
      },
      center: true,
      padding: "10px",
    },
    extend: {
      screens: {
        xs: "420px",
      },
      fontSize: {
        "2xs": ["10px", "12px"],
        xs: ["12px", "14px"],
        sm: ["14px", "16px"],
        base: ["16px", "18px"],
        md: ["18px", "20px"],
        lg: ["20px", "28px"],
        xl: ["24px", "32px"],
      },
      dropShadow: {
        icon: "0 1px 0px rgba(0, 0, 0, 0.3)",
        modal: "-5px 5px 5px rgba(0, 0, 0, 0.1)",
        book: "-2px 2px 3px rgba(0, 0, 0, 0.1)",
        light: "0 0 1px rgb(var(--white-light) / 1)",
        dark: "0 0 1px rgb(var(--black-dark) / 1)",
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "14px",
        xl: "18px",
        "2xl": "24px",
        "3xl": "36px",
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
