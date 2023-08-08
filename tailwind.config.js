/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      md: { max: '899px' },
      base: { max: '1250px' },
    },
    extend: {
      colors: {
        rose: {
          600: '#E8225F',
        },
        gray: {
          200: '#F0F4F5',
          300: '#C6D5DB',
          500: '#2E2E35',
          700: '#312e38',
          950: '#202022',
        },
        green: {
          400: '#63D391',
        },
        blue: {
          400: '#4B8DB5',
          600: '#205266',
        },
      },
    },
  },
  plugins: [],
}
