// src/context/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { themes } from '../themes'; // Import bộ theme của bạn

// Định nghĩa kiểu dữ liệu
interface ThemeContextType {
  themeId: string;
  setThemeId: (id: string) => void;
  currentTheme: typeof themes.happy; // Lấy kiểu từ theme mẫu
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Lấy theme từ localStorage nếu có, không thì mặc định là 'happy'
  const [themeId, setThemeIdState] = useState(() => {
    return localStorage.getItem('app-theme') || 'happy';
  });

  // Mỗi khi themeId thay đổi, lưu lại vào localStorage
  useEffect(() => {
    localStorage.setItem('app-theme', themeId);
  }, [themeId]);

  const setThemeId = (id: string) => {
    setThemeIdState(id);
  };

  // Tính toán object màu hiện tại
  const currentTheme = themes[themeId as keyof typeof themes] || themes.happy;

  return (
    <ThemeContext.Provider value={{ themeId, setThemeId, currentTheme }}>
      {/* Áp dụng màu nền cho thẻ DIV bao quanh toàn bộ App
         min-h-screen để đảm bảo nó phủ kín màn hình
      */}
      <div 
        style={{ 
          backgroundColor: currentTheme.background, 
          color: currentTheme.text,
          minHeight: '100vh',
          transition: 'background-color 0.5s ease' // Hiệu ứng chuyển màu mượt
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

// Hook để các trang khác gọi dùng dễ dàng
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}