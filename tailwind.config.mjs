/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,astro}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        button: 'var(--color-button)',
        buttonHover: 'var(--color-button-hover)',
        background: 'var(--color-background)',
        text: 'var(--text)',
      },
    },
  },
  plugins: [],
};
