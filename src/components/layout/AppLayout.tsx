import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
import { useCurrentUser } from '@/features/auth/api/get-current-user';
import { User } from '@/features/auth/types';
import { CompleteProfileForm } from '@/features/auth/components/CompleteProfileForm';

export const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const { data: user, isLoading, error } = useCurrentUser();

  useEffect(() => {
    // Logic redirect khi lỗi auth
    if (!isLoading && !user && error) {
       // navigate('/login'); // Uncomment nếu muốn redirect
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
      else setSidebarOpen(true); // Desktop mặc định mở
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Loading application...</div>;
  }

  if (!user && window.localStorage.getItem("accessToken") != null) {
    console.log(window.localStorage.getItem("accessToken"))
    return <CompleteProfileForm />;
  }

  const defaultUser: User = {
    id: 'guest',
    username: 'guest',
    email: '',
    firstName: 'Guest',
    lastName: 'User',
    displayName: 'Guest',
    avatar: '',
    bio: '',
    followersCount: 0,
    followingCount: 0,
    isFollowing: false
  };

  const displayUser = user || defaultUser;

  return (
    <div className="min-h-screen bg-transparent text-foreground transition-colors duration-500">
      <Topbar 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        notificationsCount={0}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentUser={displayUser}
      />
      
      <div className="flex">
        <Sidebar 
          className={sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          isOpen={sidebarOpen} // Dùng cho overlay mobile
          onClose={() => setSidebarOpen(false)}
        />
        
        <main className={`flex-1 min-w-0 transition-all duration-300 ${sidebarOpen ? 'lg:ml-0' : ''}`}>
          <div className="w-full mx-auto px-4 md:px-6 py-8">
            <Outlet context={{ searchQuery, currentUser: displayUser }} />
          </div>
        </main>
      </div>
    </div>
  );
};