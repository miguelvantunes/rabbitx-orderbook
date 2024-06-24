/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    {
      pattern: /bg-(red|green)-(300|800)/,
      variants: ['hover'],
    },
    {
      pattern: /text-(red|green)-(800)/,
    },
    {
      pattern: /border-(red|green)-(800)/,
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
