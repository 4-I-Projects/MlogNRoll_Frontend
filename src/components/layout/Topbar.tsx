import { Search, Menu, Bell, PenSquare, LogIn, UserPlus, LogOut } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { Badge } from '../../ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { ThemeToggle } from '../ThemeToggle';
import { User } from '../../features/auth/types';

interface TopbarProps {
  onToggleSidebar: () => void;
  notificationsCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentUser: User;
}

export function Topbar({ 
  onToggleSidebar, 
  notificationsCount,
  searchQuery,
  onSearchChange,
  currentUser,
}: TopbarProps) {
  const navigate = useNavigate();
  const auth = useAuth();
  
  const isAuthenticated = auth.isAuthenticated;

  const displayName = currentUser.displayName || auth.user?.profile.preferred_username || 'User';
  const avatarUrl = currentUser.avatar;
  const initial = displayName.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    auth.signoutRedirect({ post_logout_redirect_uri: window.location.origin });
  };

  // [MỚI] Hàm xử lý khi bấm nút Write
  const handleWriteClick = () => {
    if (isAuthenticated) {
      navigate('/editor');
    } else {
      auth.signinRedirect();
    }
  };

  return (
    <header className="
      sticky top-0 z-50 w-full 
      bg-background/80 
      backdrop-blur-theme
      supports-[backdrop-filter]:bg-background/60 
      rounded-theme-b
      border-b-[length:var(--border-width-theme)] border-theme
      drop-shadow-theme
      mb-6 
      transition-all duration-300
    ">
      <div className="flex h-16 items-center justify-between w-full px-4 md:px-6">
        
        {/* CỤM TRÁI */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <button onClick={() => navigate('/')} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold transition-colors">M</div>
            <span className="hidden sm:inline font-bold text-lg tracking-tight">MlognRoll</span>
          </button>
        </div>

        {/* CỤM GIỮA */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
           <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-9 bg-muted/50 border-transparent focus:bg-background transition-all rounded-theme"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* CỤM PHẢI */}
        <div className="flex items-center gap-2">
          
          <ThemeToggle className="text-muted-foreground hover:text-primary" />

          {/* [MỚI] Nút Write đặt ở đây, luôn hiển thị */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2 rounded-theme text-muted-foreground hover:text-primary" 
            onClick={handleWriteClick}
          >
            <PenSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Write</span>
          </Button>

          {!isAuthenticated ? (
            <>
              <Button variant="ghost" size="sm" className="gap-2 rounded-theme" onClick={() => auth.signinRedirect()}>
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Đăng nhập</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2 rounded-theme" onClick={() => auth.signinRedirect({ prompt: 'create', extraQueryParams: { kc_action: 'register' } })}>
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Đăng ký</span>
              </Button>
            </>
          ) : (
            <>
              {/* [ĐÃ XÓA] Nút Write cũ ở vị trí này */}

              <Button variant="ghost" size="icon" className="relative rounded-full" onClick={() => navigate('/')}>
                <Bell className="h-5 w-5" />
                {notificationsCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0" variant="destructive">
                    {notificationsCount}
                  </Badge>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-transparent hover:ring-primary/20 transition-all">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={avatarUrl} alt={displayName} />
                      <AvatarFallback>{initial}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-theme border-theme shadow-theme">
                   <div className="flex items-center justify-start gap-2 p-2 font-medium text-sm">
                    <span className="truncate">{displayName}</span>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/library')}>Library</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/stories')}>Stories</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/settings')}>Settings</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </header>
  );
}