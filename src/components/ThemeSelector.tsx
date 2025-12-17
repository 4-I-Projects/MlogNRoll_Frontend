import React from "react";
import { cn } from "@/ui/utils"; // Hàm nối class tiện lợi
import { themes } from "../themes";
import { Check } from "lucide-react";

// Map ID với thông tin hiển thị (Màu đại diện & Label)
const moodConfig = {
  happy: { label: "Vui vẻ", color: "bg-yellow-400", ring: "ring-yellow-400" },
  sad: { label: "Buồn", color: "bg-slate-600", ring: "ring-slate-600" },
  angry: { label: "Giận dữ", color: "bg-red-600", ring: "ring-red-600" },
  tired: { label: "Mệt mỏi", color: "bg-stone-500", ring: "ring-stone-500" },
  romantic: { label: "Lãng mạn", color: "bg-pink-400", ring: "ring-pink-400" },
};

interface ThemeSelectorProps {
  currentThemeId: string; // Thêm prop để biết theme nào đang active
  onSelect: (themeId: string) => void;
}

export default function ThemeSelector({ currentThemeId, onSelect }: ThemeSelectorProps) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto p-1">
      {Object.entries(moodConfig).map(([id, config]) => {
        const isActive = currentThemeId === id;
        
        return (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={cn(
              "group relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300",
              config.color,
              isActive ? `scale-110 ring-2 ring-offset-2 ring-offset-transparent ${config.ring}` : "opacity-70 hover:opacity-100 hover:scale-105"
            )}
            title={config.label}
          >
            {/* Icon check khi active */}
            {isActive && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
            
            {/* Tooltip nhỏ hiện tên Mood khi hover */}
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-medium px-2 py-0.5 bg-black/80 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {config.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}