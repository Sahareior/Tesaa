/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light mode palette
        primary: {
          50: '#EFF6FF',
          500: '#3B82F6',
          700: '#1D4ED8',
        },
        bg: {
          page: '#F8F9FA',
          surface: '#FFFFFF',
        },
        border: {
          subtle: '#E9ECEF',
        },
        text: {
          secondary: '#6C757D',
          primary: '#212529',
        },
        success: '#28A745',
        warning: '#FFC107',
        error: '#DC3545',
        // Dark mode overrides
        dark: {
          primary: {
            50: '#1E293B',
            500: '#60A5FA',
            700: '#3B82F6',
          },
          bg: {
            page: '#000000',
            surface: '#141414',
          },
          border: {
            subtle: '#27272A',
          },
          text: {
            secondary: '#A1A1AA',
            primary: '#E4E4E7',
          },
          success: '#4ADE80',
          warning: '#FACC15',
          error: '#F87171',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '6': '24px',
        '8': '32px',
        '12': '48px',
        '16': '64px',
      },
      borderRadius: {
        'md': '8px',
        'lg': '12px',
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 2px 4px rgba(59, 130, 246, 0.05)',
        'md': '0 4px 12px rgba(59, 130, 246, 0.1)',
        'lg': '0 10px 24px rgba(59, 130, 246, 0.15)',
      },
      maxWidth: {
        '8xl': '1440px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      transitionTimingFunction: {
        'bounce-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}