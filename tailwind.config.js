export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { blue:'#6DB8F0', 'blue-light':'#8DCCF5', 'blue-dark':'#4DA0D8' },
        surface: { 950:'#0A1018', 900:'#101722', 800:'#181F2D', 700:'#1F2A3A', 600:'#2A374A' }
      },
      fontFamily: { sans: ['Inter','system-ui','-apple-system','sans-serif'] }
    }
  },
  plugins: [],
}
