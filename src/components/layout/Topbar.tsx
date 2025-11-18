import { Search, Menu, Bell, PenSquare, LogIn, UserPlus } from 'lucide-react';
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
import { User } from '@/features/auth/types';
import { Badge } from '../../ui/badge';
import { useNavigate } from 'react-router-dom';

interface TopbarProps {
  onToggleSidebar: () => void;
  user: User;
  notificationsCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Topbar({ 
  onToggleSidebar, 
  user, 
  notificationsCount,
  searchQuery,
  onSearchChange,
}: TopbarProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">
              M
            </div>
            <span className="hidden sm:inline">Medium Clone</span>
          </button>
        </div>

        <div className="flex-1 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-9 bg-gray-50 border-gray-200"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => navigate('/login')}
          >
            <LogIn className="h-4 w-4" />
            <span className="hidden sm:inline">Đăng nhập</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => navigate('/register')}
          >
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Đăng ký</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => navigate('/editor')}
          >
            <PenSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Write</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => navigate('/')}
          >
            <Bell className="h-5 w-5" />
            {notificationsCount > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
                variant="destructive"
              >
                {notificationsCount}
              </Badge>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/library')}>
                Library
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/stories')}>
                Stories
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}