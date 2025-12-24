/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        'theme': 'var(--radius-theme)',
        'theme-t': 'var(--radius-theme) var(--radius-theme) 0 0',
        'theme-b': '0 0 var(--radius-theme) var(--radius-theme)',
      },
      borderWidth: {
        'theme': 'var(--border-width-theme)',
      },
      borderColor: {
        'theme': 'var(--border-color-theme)',
      },
      // Dùng dropShadow thay vì boxShadow để tương thích tốt với clip-path và kính mờ
      dropShadow: {
        'theme': 'var(--card-filter)', 
      },
      backgroundImage: {
        'theme-pattern': 'var(--bg-pattern)',
      },
      backdropBlur: {
        'theme': 'var(--backdrop-blur-theme)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}