/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#07110D',
          surface: '#0B1711',
          sidebar: '#08130E',
          card: '#0E1D15',
          elevated: '#12271B',
          neon: '#39FF88',
          accent: '#19C96B',
          muted: '#729B81',
          text: '#E8F5EC',
          subtext: '#9CB4A3',
          border: '#20392A',
          critical: '#FF4D5A',
          high: '#FF9B50',
          medium: '#FFD166',
          low: '#39FF88',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'neon-glow': '0 0 15px rgba(57, 255, 136, 0.15)',
        'neon-strong': '0 0 25px rgba(57, 255, 136, 0.3)',
        'card-glow': '0 4px 20px rgba(0, 0, 0, 0.4)',
      }
    },
  },
  plugins: [],
};
