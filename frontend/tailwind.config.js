/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Newsreader', 'DM Serif Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      colors: {
        medichat: {
          bg: '#FAF8F5',
          card: '#FFFFFF',
          green: {
            DEFAULT: '#2D4A3E',
            hover: '#233B31',
            light: '#3D6356',
            box: '#22382F',
            soft: '#5C8266'
          },
          mint: '#D1E7DD',
          sand: '#EBE6DF',
          peach: '#FDE2D6',
          rust: '#A03E24',
          text: '#2C3531',
          muted: '#6B7A74',
          border: '#E8E4DD'
        }
      }
    },
  },
  plugins: [],
}