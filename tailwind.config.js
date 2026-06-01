/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        slateInk: '#111827',
        panel: '#172033',
        warning: '#f97316',
        critical: '#dc2626',
      },
      boxShadow: {
        civic: '0 18px 60px rgba(15, 23, 42, 0.18)',
      },
    },
  },
  plugins: [],
};
