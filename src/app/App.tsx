import { useState, useEffect } from 'react';
import { Topbar } from '../components/layout/Topbar';
import { Sidebar } from '../components/layout/Sidebar';
import { Home } from '../pages/Home';
import { PostDetailPage } from '../pages/PostDetailPage';
import { EditorPage } from '../pages/EditorPage';
import { Library } from '../pages/Library';
import { Stories } from '../pages/Stories';
import { Profile } from '../pages/Profile';
import { Following } from '../pages/Following';
import { Settings } from '../pages/Settings';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Toaster } from '../ui/sonner';
import { Page } from '../lib/types';
import { currentUser, getUnreadNotificationsCount } from '../lib/mockData';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentPostId, setCurrentPostId] = useState<string | undefined>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notificationsCount = getUnreadNotificationsCount();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNavigate = (page: string, postId?: string) => {
    setCurrentPage(page as Page);
    setCurrentPostId(postId);
    
    // Close sidebar on mobile after navigation
    if (isMobile) {
      setSidebarOpen(false);
    }

    // Scroll to top
    window.scrollTo(0, 0);
  };

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  // Editor page has its own layout
  if (currentPage === 'editor') {
    return (
      <>
        <EditorPage onNavigate={handleNavigate} currentUser={currentUser} />
        <Toaster />
      </>
    );
  }

  // Login and Register pages have their own full-screen layout
  if (currentPage === 'login') {
    return (
      <>
        <Login onNavigate={handleNavigate} />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'register') {
    return (
      <>
        <Register onNavigate={handleNavigate} />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Topbar
        onToggleSidebar={handleToggleSidebar}
        onNavigate={handleNavigate}
        user={currentUser}
        notificationsCount={notificationsCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex">
        <Sidebar
          visible={sidebarOpen}
          activeTab={currentPage}
          onNavigate={handleNavigate}
          onClose={handleCloseSidebar}
          isMobile={isMobile}
        />

        <main className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
            {currentPage === 'home' && (
              <Home onNavigate={handleNavigate} searchQuery={searchQuery} />
            )}
            
            {currentPage === 'post-detail' && currentPostId && (
              <PostDetailPage
                postId={currentPostId}
                currentUser={currentUser}
                onNavigate={handleNavigate}
              />
            )}
            
            {currentPage === 'library' && (
              <Library onNavigate={handleNavigate} />
            )}
            
            {currentPage === 'stories' && (
              <Stories onNavigate={handleNavigate} />
            )}
            
            {currentPage === 'profile' && (
              <Profile onNavigate={handleNavigate} />
            )}
            
            {currentPage === 'following' && (
              <Following onNavigate={handleNavigate} />
            )}
            
            {currentPage === 'settings' && (
              <Settings currentUser={currentUser} />
            )}
          </div>
        </main>
      </div>

      <Toaster />
    </div>
  );
}
