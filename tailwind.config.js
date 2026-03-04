/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f4f5f1',
          100: '#e1e5d3',
          200: '#c5ceaa',
          300: '#a3b17c',
          400: '#7b8a5d', // Primary
          500: '#64724a',
          600: '#4d583a',
          700: '#3d462f',
          800: '#323928',
          900: '#2c3124',
        },
        cream: {
          50: '#fefefe',
          100: '#fcfaf7', // Background
          200: '#f7f1e9',
          300: '#eee3d2',
          400: '#dfcaad',
        },
        gold: {
          DEFAULT: '#d4af37',
          light: '#e5c96e',
          dark: '#b39023',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'watercolor': "url('/images/bg_texture.png')",
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out forwards',
        'pulse-subtle': 'pulse-subtle 2s infinite',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-subtle': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
}
