/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#534AB7',
        'primary-light': '#a78bfa',
        'primary-dark': '#3C3489',
        surface: '#1a1a2e',
        'surface-2': '#16213e',
        'surface-3': '#0f0f1a',
        border: '#2a2a4a',
        'text-primary': '#e2e8f0',
        'text-secondary': '#94a3b8',
        'text-muted': '#64748b',
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI',
          'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}