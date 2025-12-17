import React from "react";

const moods = [
  { id: "happy", label: "Vui vẻ" },
  { id: "sad", label: "Buồn" },
  { id: "angry", label: "Giận dữ" },
  { id: "tired", label: "Mệt mỏi" },
  { id: "romantic", label: "Lãng mạn" }
];

interface ThemeSelectorProps {
  onSelect: (themeId: string) => void;
}

export default function ThemeSelector({ onSelect }: ThemeSelectorProps) {
  return (
    <div className="theme-selector">
      {moods.map(m => (
        <button
          key={m.id}
          onClick={() => onSelect(m.id)}
          style={{ marginRight: 8, padding: "6px 12px" }}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
