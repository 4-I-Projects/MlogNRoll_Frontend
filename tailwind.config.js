/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 1. Map Border Radius
      borderRadius: {
        'theme': 'var(--radius-theme)', // Class: rounded-theme
        'theme-t': 'var(--radius-theme) var(--radius-theme) 0 0', // Class: rounded-theme-t
        'theme-b': '0 0 var(--radius-theme) var(--radius-theme)', // Class: rounded-theme-b
      },
      // 2. Map Border Width
      borderWidth: {
        'theme': 'var(--border-width-theme)', // Class: border-theme
      },
      // 3. Map Border Color (Thêm màu viền theme)
      borderColor: {
        'theme': 'var(--border-color-theme)', // Class: border-theme
      },
      // 4. Map Box Shadow
      boxShadow: {
        'theme': 'var(--shadow-theme)', // Class: shadow-theme
      },
      // 5. Map Backdrop Blur (Dùng arbitrary value trong code cũng được, nhưng map thì gọn hơn)
      backdropBlur: {
        'theme': 'var(--backdrop-blur-theme)', // Class: backdrop-blur-theme
      }
    },
  },
  plugins: [],
}