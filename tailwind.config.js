/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0f0e0c',
        surface: '#1c1b19',
        'surface-2': '#201f1d',
        text: '#cdccca',
        'text-muted': '#797876',
        'accent-coral': '#e8613a',
        'accent-gold': '#c8a85c',
        border: '#2e2d2b',
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        body: ['"Work Sans"', '"Helvetica Neue"', 'sans-serif'],
      },
      borderRadius: {
        'none': '0',
      },
      boxShadow: {
        'none': 'none',
      },
    },
  },
  plugins: [],
}
