/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#2563EB',
        secondary: '#1E293B',
        background: '#F8FAFC',
        card: '#FFFFFF',
        success: '#22C55E',
        error: '#EF4444',
      }
    },
  },
  plugins: [],
}
