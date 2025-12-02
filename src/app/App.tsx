import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // [MỚI]
import { router } from './routes';
import { Toaster } from '@/ui/sonner';

// [MỚI] Tạo instance client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Tắt tự động fetch lại khi switch tab
      retry: 1, // Số lần thử lại nếu lỗi
    },
  },
});

export default function App() {
  return (
    // [MỚI] Bọc Provider ra ngoài cùng
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  );
}