import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../ui/utils';
import {
  Layout,
  TrendingUp,
  Hash,
  BookMarked,
  Settings,
  HelpCircle,
  FileText,
  User,
  ChevronRight
} from 'lucide-react';
import { ScrollArea } from '../../ui/scroll-area';
import { Button } from '../../ui/button';
import { useTheme } from '../../context/ThemeContext';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { currentTheme } = useTheme();

  const navItems = [
    { icon: Layout, label: 'My Feed', href: '/' },
    { icon: TrendingUp, label: 'Trending', href: '/trending' },
    { icon: Hash, label: 'Explore Topics', href: '/topics' },
    { icon: BookMarked, label: 'Library', href: '/library' },
    { icon: FileText, label: 'Stories', href: '/stories' },
    { icon: User, label: 'Profile', href: '/profile' },
  ];

  const footerItems = [
    { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: HelpCircle, label: 'Help', href: '/help' },
  ];

  return (
    <>
      {/* Overlay cho Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-16 bottom-0 w-64 z-40 transition-transform duration-300 lg:translate-x-0 lg:sticky lg:h-[calc(100vh-4rem)]",
          
          /* --- THAY ĐỔI STYLE Ở ĐÂY --- */
          /* 1. Xóa 'border-r' mặc định */
          /* 2. Xóa 'bg-background/95' */
          
          /* 3. Dùng biến Sidebar mới: trong suốt + màu theme */
          "bg-[var(--sidebar)]",
          
          /* 4. Thêm hiệu ứng kính mờ (đồng bộ với Topbar/Card) */
          "backdrop-blur-[var(--backdrop-blur-theme)]",
          
          /* 5. Viền bên phải: chỉ hiện khi cần (ví dụ Angry/Tired) */
          "border-r border-[var(--sidebar-border)]",
          
          /* 6. Bóng đổ nhẹ nếu muốn sidebar nổi lên */
          "shadow-lg lg:shadow-none", // Mobile có bóng, Desktop thì thôi cho liền mạch
          
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <ScrollArea className="h-full py-6">
          <div className="px-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-theme text-sm font-medium transition-all duration-200", // Thêm rounded-theme cho item
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-white/20 hover:text-foreground hover:translate-x-1" // Hover effect mượt hơn
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                {/* Dấu mũi tên nhỏ khi active (tùy chọn) */}
                {/* {isActive && <ChevronRight className="ml-auto h-4 w-4 opacity-50" />} */}
              </NavLink>
            ))}
          </div>

          <div className="mt-8 px-3">
            <h3 className="mb-2 px-4 text-xs font-semibold text-muted-foreground tracking-wider uppercase opacity-70">
              System
            </h3>
            <div className="space-y-1">
              {footerItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={() => window.innerWidth < 1024 && onClose()}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-theme text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-white/20 hover:text-foreground"
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
          
          {/* Card quảng cáo nhỏ dưới cùng (nếu có) */}
          <div className="mt-8 mx-4 p-4 rounded-theme bg-white/10 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
               <Avatar className="h-8 w-8">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="text-xs">
                <p className="font-semibold text-foreground">Pro Member</p>
                <p className="text-muted-foreground">Upgrade now</p>
              </div>
            </div>
            <Button size="sm" variant="secondary" className="w-full text-xs h-8 rounded-theme">
              View Plans
            </Button>
          </div>

        </ScrollArea>
      </aside>
    </>
  );
}