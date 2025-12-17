import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
import { useCurrentUser } from '@/features/auth/api/get-current-user';
import { User } from '@/features/auth/types';

export const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const { data: user, isLoading, error } = useCurrentUser();

  useEffect(() => {
    // Logic redirect
    if (!isLoading && !user && error) {
    }
  }, [user, isLoading, error, navigate]);

  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [location.pathname, isMobile]);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 1024;
      setIsMobile(isMobileView);
      if (isMobileView) setSidebarOpen(false);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Loading application...</div>;
  }

  const defaultUser: User = {
    id: '',
    name: 'Guest',
    avatar: '',
    bio: '',
    followersCount: 0,
    followingCount: 0
  };

  const displayUser = user || defaultUser;

  return (
    <div className="min-h-screen bg-transparent text-foreground transition-colors duration-500">
      <Topbar 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        notificationsCount={0}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <div className="flex">
        <Sidebar 
          visible={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          isMobile={isMobile}
        />
        
        <main className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
            <Outlet context={{ searchQuery, currentUser: displayUser }} />
          </div>
        </main>
      </div>
    </div>
  );
};