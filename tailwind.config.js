/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium Warehouse Theme
        primary: {
          navy: '#1E293B',
          DEFAULT: '#1E293B',
        },
        background: {
          sand: '#FAF9F7',
          DEFAULT: '#FAF9F7',
        },
        sidebar: {
          stone: '#E2E8F0',
          DEFAULT: '#E2E8F0',
        },
        accent: {
          gold: '#D4A657',
          sage: '#9CAFAA',
          DEFAULT: '#D4A657',
        },
        chart: {
          navy: '#2C3E50',
          gold: '#F1C40F',
        },
        // Semantic colors
        success: '#9CAFAA',
        danger: '#E74C3C',
        warning: '#F1C40F',
        info: '#2C3E50',
      },
      borderRadius: {
        'card': '12px',
      },
      boxShadow: {
        'card': '0 4px 12px rgba(0,0,0,0.07)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.12)',
      },
      transitionDuration: {
        'smooth': '250ms',
      },
    },
  },
  plugins: [],
}
