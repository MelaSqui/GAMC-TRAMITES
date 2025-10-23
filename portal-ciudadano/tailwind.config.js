/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#eef5ff',
          100: '#e2e8ff',
          500: '#5B2D91',   // morado principal
          600: '#43207a',
        },
        accent: {
          400: '#3ec1e6',   // celestes de tu paleta
          500: '#00a9d9',
          600: '#1b9cc6',
        },
        lilac:  { 500: '#6e56a3' },
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // si las tienes instaladas, puedes dejarlas:
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/aspect-ratio'),
  ],
};
