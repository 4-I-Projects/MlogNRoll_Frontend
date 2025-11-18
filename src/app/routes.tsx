import { createBrowserRouter, Outlet } from 'react-router-dom';
import { Home } from '@/pages/Home';
import { PostDetailPage } from '@/pages/PostDetailPage';
import { EditorPage } from '@/pages/EditorPage';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { Library } from '@/pages/Library';
import { Stories } from '@/pages/Stories';
import { Profile } from '@/pages/Profile';
import { Following } from '@/pages/Following';
import { Settings } from '@/pages/Settings';
import { Topbar } from '@/components/layout/Topbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { currentUser } from '@/lib/mockData'; // Mock data tạm thời
import { useState, useEffect } from 'react';

// Layout chính bao gồm Sidebar và Topbar
const AppLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* Topbar không cần truyền onNavigate nữa */}
            <Topbar
                onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                user={currentUser}
                notificationsCount={3} // Mock
                searchQuery=""
                onSearchChange={() => { }} onNavigate={function (): void {
                    throw new Error('Function not implemented.');
                }} />

            <div className="flex">
                <Sidebar
                    visible={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    isMobile={isMobile}
                    onNavigate={() => {}} />

                <main className="flex-1 min-w-0">
                    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
                        {/* Outlet là nơi nội dung các page con sẽ hiển thị */}
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: [
            // Code sạch sẽ hơn rất nhiều
            { path: '', element: <Home searchQuery="" /> },
            { path: 'post/:postId', element: <PostDetailPage currentUser={currentUser} postId={''} onNavigate={function (page: string, postId?: string): void {
                throw new Error('Function not implemented.');
            } } /> },
            { path: 'library', element: <Library onNavigate={function (page: string, postId?: string): void {
                throw new Error('Function not implemented.');
            } } /> },
            { path: 'stories', element: <Stories onNavigate={function (page: string, postId?: string): void {
                throw new Error('Function not implemented.');
            } } /> },
            { path: 'profile/:userId?', element: <Profile onNavigate={function (page: string, postId?: string): void {
                throw new Error('Function not implemented.');
            } } /> },
            { path: 'following', element: <Following onNavigate={function (page: string, userId?: string): void {
                throw new Error('Function not implemented.');
            } } /> },
            { path: 'settings', element: <Settings currentUser={currentUser} /> },
        ],  
    },
    {
        // Các trang full-screen không có Layout chung
        path: '/editor',
        element: <EditorPage currentUser={currentUser} onNavigate={function (page: string): void {
            throw new Error('Function not implemented.');
        }} />,
    },
    {
        path: '/login',
        element: <Login onNavigate={function (page: string): void {
            throw new Error('Function not implemented.');
        }} />,
    },
    {
        path: '/register',
        element: <Register onNavigate={function (page: string): void {
            throw new Error('Function not implemented.');
        }} />,
    },
]);