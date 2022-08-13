/** @type {import('tailwindcss').Config} */ 
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '720px',
      lg: '960px',
      xl: '1200px',
      max: '1440px',
    },
    colors: {
      primary: '#21C728',
      accent: '#35BEEA',
      dark: '#333',
      light: '#eee'
    },
    extend: {},
    fontFamily: {
      sans: ['Signika Negative', 'sans-serif'],
    },
  },
  plugins: [],
}
