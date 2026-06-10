/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        tyson: {
          red:    '#DA291C',
          burgundy: '#7A1020',
          yellow: '#FFC72C',
          dark:   '#520010',
          sidebar:'#FFFFFF',
          bg:     '#F8F9FA',
          card:   '#FFFFFF'
        },
        brand: {
          fb:  '#1877F2',
          ig:  '#E1306C',
          tt:  '#000000',
          aon: '#FFc220',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in':    'fadeIn 0.5s ease-out forwards',
        'slide-up':   'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'count-up':   'countUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(24px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
      },
      boxShadow: {
        card: '0 4px 20px -2px rgba(17, 17, 17, 0.05), 0 0 3px rgba(17, 17, 17, 0.02)',
        'card-hover': '0 12px 32px -4px rgba(17, 17, 17, 0.08), 0 0 4px rgba(17, 17, 17, 0.03)',
      }
    },
  },
  plugins: [],
}
