/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8f4f2',
          100: '#d4ece8',
          200: '#b8d4cf',
          300: '#91c9c3',
          400: '#56e0d4',
          500: '#2ec4b6',
          600: '#1a9e92',
          700: '#0d7a70',
          800: '#0b6058',
          900: '#0a4b45',
          950: '#073a35'
        },
        dark: {
          50: '#e8f4f2',
          100: '#dbe4ea',
          200: '#b8d4cf',
          300: '#5a7a88',
          400: '#1a2e42',
          500: '#152535',
          600: '#0f1e30',
          700: '#0b1520',
          800: '#08101a',
          900: '#050b14',
          950: '#03070e'
        },
        accent: {
          gold: '#f4c430',
          green: '#4ade80'
        }
      },
      fontFamily: {
        sans: ['Barlow', 'system-ui', 'sans-serif'],
        display: ['Barlow Condensed', 'Barlow', 'system-ui', 'sans-serif'],
        mono: ['Share Tech Mono', 'ui-monospace', 'SFMono-Regular', 'monospace']
      }
    }
  },
  plugins: []
};