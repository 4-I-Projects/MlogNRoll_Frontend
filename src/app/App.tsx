import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { Toaster } from '@/ui/sonner';

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}