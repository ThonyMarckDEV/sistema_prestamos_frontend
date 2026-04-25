/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red:        '#8B1A1A', // Rojo corporativo principal
          'red-dark': '#6B1111', // Rojo hover/oscuro
          'red-light':'#F5E6E6', // Rojo muy claro para fondos
          gold:       '#F5A623', // Dorado/amarillo del logo
          'gold-dark':'#D4891A', // Dorado hover
          'gold-light':'#FEF3DC',// Dorado muy claro para fondos
          cream:      '#FAF7F4', // Crema para fondos neutros
        },
        primary: {
          DEFAULT: '#8B1A1A',
          hover:   '#6B1111',
          light:   '#F5E6E6',
        },
        secondary: {
          DEFAULT: '#ffffff',
          text:    '#374151',
          muted:   '#9ca3af',
        }
      },
    }
  },
  plugins: [],
}