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
      accent: 'hsl(200, 100%, 40%)',
      accentDark: 'hsl(200, 100%, 35%)',
      accentLight: 'hsl(200, 100%, 45%)',
      success: '#21C728',
      successDark: '#118A16',
      alert: '#ff922b',
      error: '#e03131',
      dark: '#333',
      darkTransparent: '#333333AA',
      light: '#eee',
      white: '#fff',
      stroke: '#0068584f',
      strokeLight: 'rgba(238, 238, 238, 0.5)'
    },
    extend: {},
    fontFamily: {
      sans: ['Signika Negative', 'sans-serif'],
    },
  },
  plugins: [],
}
