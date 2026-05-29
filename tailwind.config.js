/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#9B89C4',
          'purple-light': '#C4B5F5',
          'purple-dark': '#7B6BA4',
          blue: '#7BB3D0',
          'blue-light': '#B3D4E8',
          'blue-dark': '#5B93B0',
          green: '#86C5A3',
          'green-light': '#B3DFC5',
          'green-dark': '#66A583',
          peach: '#F0A882',
          'peach-light': '#F5C8B0',
          'peach-dark': '#D08862',
          yellow: '#F5D78E',
          'yellow-light': '#FAE8B8',
          'yellow-dark': '#D5B76E',
          pink: '#D4A5C7',
          'pink-light': '#E8C8DE',
          'pink-dark': '#B485A7',
          teal: '#72B5B0',
          'teal-light': '#A4D0CC',
          'teal-dark': '#529590',
          coral: '#E89090',
          'coral-light': '#F5B8B8',
          'coral-dark': '#C87070',
        },
        calm: {
          50: '#FAFAF9',
          100: '#F5F3F0',
          200: '#EDE9E4',
          300: '#DDD9D2',
          400: '#C8C3BA',
        },
        night: {
          800: '#1E2040',
          850: '#171930',
          900: '#111225',
          950: '#0A0B1A',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', '-apple-system', 'sans-serif'],
        dyslexic: ['Lexend', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 2px 15px -3px rgba(0,0,0,0.07), 0 10px 20px -2px rgba(0,0,0,0.04)',
        card: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 20px rgba(0,0,0,0.10), 0 8px 32px rgba(0,0,0,0.08)',
        glow: '0 0 20px rgba(155,137,196,0.35)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        popIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '60%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        starPop: {
          '0%': { transform: 'scale(0) rotate(-30deg)', opacity: '0' },
          '60%': { transform: 'scale(1.3) rotate(10deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        'pop-in': 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'slide-up': 'slideUp 0.4s ease-out',
        'star-pop': 'starPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
