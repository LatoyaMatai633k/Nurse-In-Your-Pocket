import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FAF7F2',
        sand: '#EFE7DB',
        nude: '#E5D6C8',
        plum: '#3A1448',
        purple: {
          50: '#FBF8FD',
          100: '#F4ECFA',
          200: '#E8D5F2',
          300: '#D5B6E6',
          400: '#B88CD3',
          500: '#945CBA',
          600: '#7B42A3',
          700: '#6B3B8B',
          800: '#52296E',
          900: '#3A1448',
        },
        lavender: '#EFE6F7',
        cocoa: '#2D1F33',
        sage: '#4B735F',
        rose: '#9E3852',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px rgba(58, 20, 72, 0.05)',
        lift: '0 10px 30px rgba(58, 20, 72, 0.09)',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
} satisfies Config
