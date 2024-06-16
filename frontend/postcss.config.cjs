/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    'postcss-import': {},
    'tailwindcss': {},
    'autoprefixer': {},
    'postcss-preset-env': {
      stage: 1,
      autoprefixer: {
        flexbox: "no-2009",
      },
    },
  },
};

module.exports = config;
