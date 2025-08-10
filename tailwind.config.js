/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: {
          100: '#FFE5DE',
          600: '#FF6F50',
          700: '#E65B3F',
        },
        neutral: {
          0: '#FFFFFF',
          100: '#F5F5F5',
          600: '#6B7280',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'sans-serif'],
      },
      fontSize: {
        display: ['72px', { lineHeight: '80px', fontWeight: '700' }],
        h2: ['48px', { lineHeight: '56px', fontWeight: '600' }],
        h3: ['28px', { lineHeight: '36px', fontWeight: '600' }],
        body: ['16px', { lineHeight: '24px' }],
        caption: ['13px', { lineHeight: '18px' }],
      },
    },
  },
  plugins: [],
};
