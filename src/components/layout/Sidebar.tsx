import { Home, Library, FileText, Users, Settings, Bookmark, Star, Clock, LogIn, UserPlus } from 'lucide-react';
import { cn } from '../../ui/utils';
import { Button } from '../../ui/button';
import { Sheet, SheetContent } from '../../ui/sheet';
import { ScrollArea } from '../../ui/scroll-area';
import { Separator } from '../../ui/separator';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
  isMobile: boolean;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  children?: { id: string; label: string; icon: React.ReactNode }[];
}

const navItems: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: <Home className="h-5 w-5" />,
  },
  {
    id: 'library',
    label: 'Library',
    icon: <Library className="h-5 w-5" />,
    children: [
      { id: 'library-saved', label: 'Saved', icon: <Bookmark className="h-4 w-4" /> },
      { id: 'library-favorites', label: 'Favorites', icon: <Star className="h-4 w-4" /> },
      { id: 'library-later', label: 'Read later', icon: <Clock className="h-4 w-4" /> },
    ],
  },
  {
    id: 'stories',
    label: 'Stories',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    id: 'following',
    label: 'Following',
    icon: <Users className="h-5 w-5" />,
  },
];

function SidebarContent() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentPath = location.pathname === '/' ? 'home' : location.pathname.substring(1);

  const handleNavigate = (path: string) => {
    const targetPath = path === 'home' ? '/' : `/${path}`;
    navigate(targetPath);
  };

  return (
    <ScrollArea className="h-full py-6">
      <div className="space-y-1 px-3">
        {navItems.map((item) => (
          <div key={item.id}>
            <Button
              variant={currentPath.startsWith(item.id) || (item.id === 'home' && currentPath === 'home') ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start gap-3',
                (currentPath.startsWith(item.id) || (item.id === 'home' && currentPath === 'home')) && 'bg-gray-100'
              )}
              onClick={() => handleNavigate(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-xs">
                  {item.badge}
                </span>
              )}
            </Button>
            
            {item.children && currentPath.startsWith(item.id) && (
              <div className="ml-4 mt-1 space-y-1">
                {item.children.map((child) => (
                  <Button
                    key={child.id}
                    variant={currentPath === child.id ? 'secondary' : 'ghost'}
                    size="sm"
                    className={cn(
                      'w-full justify-start gap-2 pl-8',
                      currentPath === child.id && 'bg-gray-100'
                    )}
                    onClick={() => navigate('/library')} // Ví dụ chuyển tab trong library
                  >
                    {child.icon}
                    <span>{child.label}</span>
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
        
        <Separator className="my-4" />
        
        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
          onClick={() => navigate('/login')}
        >
          <LogIn className="h-5 w-5" />
          <span>Đăng nhập</span>
        </Button>
        
        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
          onClick={() => navigate('/register')}
        >
          <UserPlus className="h-5 w-5" />
          <span>Đăng ký</span>
        </Button>
        
        <Separator className="my-4" />
        
        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
          onClick={() => navigate('/settings')}
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Button>
      </div>
    </ScrollArea>
  );
}

export function Sidebar({ visible, onClose, isMobile }: SidebarProps) {
  if (isMobile) {
    return (
      <Sheet open={visible} onOpenChange={onClose}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  if (!visible) return null;

  return (
    <aside className="hidden lg:block w-64 border-r bg-white">
      <SidebarContent />
    </aside>
  );
}