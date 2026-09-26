/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A4D2E',
          50: '#F4F7F4',
          100: '#EBF2EA',
          800: '#1A4D2E',
          900: '#143D24',
        }
      }
    },
  },
  plugins: [],
}
