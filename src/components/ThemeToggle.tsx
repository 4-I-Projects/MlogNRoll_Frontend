import { Palette } from 'lucide-react';
import { Button } from '@/ui/button';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/ui/utils';

interface ThemeToggleProps {
  className?: string;
  style?: React.CSSProperties; // Để EditorPage có thể truyền màu chữ động vào
}

export function ThemeToggle({ className, style }: ThemeToggleProps) {
  const { themeId, setThemeId } = useTheme();

  const cycleTheme = () => {
    const themes = ['happy', 'sad', 'angry', 'tired', 'romantic'];
    const currentIndex = themes.indexOf(themeId);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % themes.length;
    setThemeId(themes[nextIndex]);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      title={`Đổi giao diện (Hiện tại: ${themeId})`}
      className={cn("rounded-full transition-all hover:scale-110", className)}
      style={style}
    >
      <Palette className="h-5 w-5" />
    </Button>
  );
}