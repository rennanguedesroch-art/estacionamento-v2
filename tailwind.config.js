/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        asphalt: {
          DEFAULT: '#0B0B0D',
          soft: '#17171A',
          line: '#2A2A2E',
        },
        signal: {
          DEFAULT: '#F5B301',
          bright: '#FFCB2E',
          dim: '#8A6300',
        },
        chalk: '#F4F2ED',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
    },
  },
  plugins: [],
};
