import { Home, Library, FileText, Users, Settings, Bookmark, Star, Clock, LogIn, UserPlus } from 'lucide-react';
import { cn } from '../../ui/utils';
import { Button } from '../../ui/button';
import { Sheet, SheetContent } from '../../ui/sheet';
import { ScrollArea } from '../../ui/scroll-area';
import { Separator } from '../../ui/separator';

interface SidebarProps {
  visible: boolean;
  activeTab: string;
  onNavigate: (page: string) => void;
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

function SidebarContent({ activeTab, onNavigate }: Pick<SidebarProps, 'activeTab' | 'onNavigate'>) {
  return (
    <ScrollArea className="h-full py-6">
      <div className="space-y-1 px-3">
        {navItems.map((item) => (
          <div key={item.id}>
            <Button
              variant={activeTab === item.id ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start gap-3',
                activeTab === item.id && 'bg-gray-100'
              )}
              onClick={() => onNavigate(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-xs">
                  {item.badge}
                </span>
              )}
            </Button>
            
            {item.children && activeTab.startsWith(item.id) && (
              <div className="ml-4 mt-1 space-y-1">
                {item.children.map((child) => (
                  <Button
                    key={child.id}
                    variant={activeTab === child.id ? 'secondary' : 'ghost'}
                    size="sm"
                    className={cn(
                      'w-full justify-start gap-2 pl-8',
                      activeTab === child.id && 'bg-gray-100'
                    )}
                    onClick={() => onNavigate(child.id)}
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
          onClick={() => onNavigate('login')}
        >
          <LogIn className="h-5 w-5" />
          <span>Đăng nhập</span>
        </Button>
        
        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
          onClick={() => onNavigate('register')}
        >
          <UserPlus className="h-5 w-5" />
          <span>Đăng ký</span>
        </Button>
        
        <Separator className="my-4" />
        
        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
          onClick={() => onNavigate('settings')}
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Button>
      </div>
    </ScrollArea>
  );
}

export function Sidebar({ visible, activeTab, onNavigate, onClose, isMobile }: SidebarProps) {
  if (isMobile) {
    return (
      <Sheet open={visible} onOpenChange={onClose}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent activeTab={activeTab} onNavigate={onNavigate} />
        </SheetContent>
      </Sheet>
    );
  }

  if (!visible) return null;

  return (
    <aside className="hidden lg:block w-64 border-r bg-white">
      <SidebarContent activeTab={activeTab} onNavigate={onNavigate} />
    </aside>
  );
}
