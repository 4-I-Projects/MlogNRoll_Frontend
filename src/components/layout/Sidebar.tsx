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
  User as UserIcon,
  Lock // Icon ổ khóa tùy chọn nếu muốn hiển thị
} from 'lucide-react';
import { ScrollArea } from '../../ui/scroll-area';
import { Button } from '../../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';

interface SidebarProps {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ className, isOpen, onClose }: SidebarProps) {
  
  // Thêm thuộc tính 'disabled' cho các mục chưa deploy
  const navItems = [
    { icon: Layout, label: 'My Feed', href: '/' },
    { icon: TrendingUp, label: 'Trending', href: '/trending', disabled: true },
    { icon: Hash, label: 'Explore Topics', href: '/topics', disabled: true },
    { icon: BookMarked, label: 'Library', href: '/library' },
    { icon: FileText, label: 'Stories', href: '/stories' },
    { icon: UserIcon, label: 'Profile', href: '/profile' },
  ];

  const footerItems = [
    { icon: Settings, label: 'Settings', href: '/settings', disabled: true },
    { icon: HelpCircle, label: 'Help', href: '/help', disabled: true },
  ];

  // Hàm render chung cho cả 2 list để đỡ lặp code
  const renderNavItems = (items: typeof navItems) => {
    return items.map((item) => {
      // Nếu disabled: Render div tĩnh, mờ đi, không click được
      if (item.disabled) {
        return (
          <div
            key={item.label}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-theme text-sm font-medium transition-all duration-200",
              "text-muted-foreground/40 cursor-not-allowed" // Style mờ và cấm click
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
            {/* Badge 'Soon' nhỏ bên phải để báo hiệu */}
            <span className="ml-auto text-[10px] font-bold uppercase tracking-wider opacity-70 border border-muted-foreground/30 px-1.5 rounded-sm">
              Soon
            </span>
          </div>
        );
      }

      // Nếu active: Render NavLink bình thường
      return (
        <NavLink
          key={item.href}
          to={item.href}
          onClick={() => window.innerWidth < 1024 && onClose?.()}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-theme text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:bg-white/20 hover:text-foreground hover:translate-x-1"
            )
          }
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </NavLink>
      );
    });
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-16 bottom-0 w-64 z-40 transition-transform duration-300 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)]",
          "bg-[var(--sidebar)]",
          "backdrop-blur-[var(--backdrop-blur-theme)]",
          "border-r border-[var(--sidebar-border)]",
          "shadow-lg lg:shadow-none",
          className 
        )}
      >
        <ScrollArea className="h-full py-6">
          
          {/* Main Navigation */}
          <div className="px-3 space-y-1">
            {renderNavItems(navItems)}
          </div>

          {/* System Footer */}
          <div className="mt-8 px-3">
            <h3 className="mb-2 px-4 text-xs font-semibold text-muted-foreground tracking-wider uppercase opacity-70">
              System
            </h3>
            <div className="space-y-1">
              {renderNavItems(footerItems)}
            </div>
          </div>
          
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