export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#299DD5',
        ink: '#08090B',
        surface: '#101216',
        muted: '#A1A1AA',
        line: 'rgba(255,255,255,0.12)',
      },
      fontFamily: {
        display: ['Archivo', 'Helvetica Neue', 'Arial', 'sans-serif'],
        sans: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      letterSpacing: {
        cinematic: '0.24em',
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [],
}
