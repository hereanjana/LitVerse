/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },

    colors: {
      'ground': '#E4E0E1',
      'light': 'D1BB9E',
      'dark': '#8C6A5D',
      'button': '#A79277',
      'text': '#FEFAF6',
      'black': '#000000',
      'purple': '#3f3cbb',
      'midnight': '#121063',
      'metal': '#565584',
      'tahiti': '#3ab7bf',
      'silver': '#ecebff',
      'bubble-gum': '#ff77e9',
      'bermuda': '#78dcca',
      'primary': "#865DFF",  
      'primary-dark': '#6a3fd3',
        // Purple
      'secondary': "#FFC0CB",  // Bubblegum
      // Silver
      'lightBg': "#FAF9FF",    // Light purple tint
      'darkText': "#2E2E3A",
      
    },
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
}

