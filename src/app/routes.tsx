import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';

// Pages
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

// Data
import { currentUser } from '@/lib/mockData';

export const router = createBrowserRouter([
  {
    // NHÓM 1: Các trang có Layout chung (Sidebar + Topbar)
    path: '/',
    element: <AppLayout />,
    children: [
      { path: '', element: <Home /> },
      { path: 'post/:postId', element: <PostDetailPage currentUser={currentUser} /> },
      { path: 'library', element: <Library /> },
      { path: 'stories', element: <Stories /> },
      { path: 'profile/:userId?', element: <Profile /> },
      { path: 'following', element: <Following /> },
      { path: 'settings', element: <Settings currentUser={currentUser} /> },
    ],
  },
  {
    // NHÓM 2: Các trang Full màn hình (riêng biệt)
    path: '/editor',
    element: <EditorPage currentUser={currentUser} />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
]);