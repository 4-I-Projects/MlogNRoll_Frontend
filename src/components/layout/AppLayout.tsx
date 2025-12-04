import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom'; // [MỚI] useNavigate
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
import { useCurrentUser } from '@/features/auth/api/get-current-user'; // [MỚI]
import { User } from '@/features/auth/types';

export const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // [MỚI] Fetch data user thật
  const { data: user, isLoading, error } = useCurrentUser();
  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Loading application...</div>;
  }

  // [MỚI] Redirect nếu chưa login (Tùy logic app của bạn)
  useEffect(() => {
    if (!isLoading && !user && error) {
      // navigate('/login'); // Bỏ comment dòng này nếu muốn bắt buộc login
    }
  }, [user, isLoading, error, navigate]);

  // Logic mobile cũ giữ nguyên...
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
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

  // [MỚI] Fallback User nếu chưa login hoặc đang load (để tránh lỗi crash UI)
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
    <div className="min-h-screen bg-white">
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
            {/* Truyền user và searchQuery xuống các trang con */}
            <Outlet context={{ searchQuery, currentUser: displayUser }} />
          </div>
        </main>
      </div>
    </div>
  );
};