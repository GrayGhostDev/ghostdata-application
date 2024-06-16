module.exports = {
  plugins: {
    "tailwindcss": {},
    "postcss-import": {},
    "postcss-nested": {},
    "postcss-preset-env": {
      stage: 1,
      features: {
        "nesting-rules": true,
      },
      autoprefixer: {
        flexbox: "no-2009",
      },
    },
    autoprefixer: {},
  },
};
