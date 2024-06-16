/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./frontend/src/**/*.{js,jsx,ts,tsx}",
    "./frontend/public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        "primary-color": "#0d3b66",
        "secondary-color": "#faa916",
        "tertiary-color": "#0d944f",
        "text-primary": "#ffffff",
        "text-secondary": "#888",
        "shadow-primary": "rgba(13, 59, 102, 0.67)",
        "shadow-secondary": "rgba(250, 169, 22, 0.67)",
      },
      animation: {
        "logo-spin": "logo-spin 20s linear infinite",
        "pacman-move": "pacman-move 5s linear infinite",
        "data-move": "data-move 5s linear infinite",
      },
      keyframes: {
        "logo-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "pacman-move": {
          "0%": { left: "0" },
          "100%": { left: "100%" },
        },
        "data-move": {
          "0%": { left: "100%" },
          "100%": { left: "0" },
        },
      },
      spacing: {
        standard: "2em",
      },
      maxWidth: {
        container: '1200px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
