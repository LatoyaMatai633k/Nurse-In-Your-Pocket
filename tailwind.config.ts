import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F8F3ED',
        nude: '#D9B6A2',
        terracotta: '#A85F4B',
        cocoa: '#35251F',
        rose: '#C98888',
        sand: '#EDE0D5',
        sage: '#5F7668',
      },
      fontFamily: {
        sans: ['DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 4px 18px rgba(53, 37, 31, 0.08)',
        lift: '0 10px 28px rgba(53, 37, 31, 0.12)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
} satisfies Config
