import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, AuthProviderProps } from 'react-oidc-context';
import { router } from './routes';
import { Toaster } from '@/ui/sonner';
import { User } from 'oidc-client-ts';
import { ThemeProvider } from '@/context/ThemeContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// [FIX] Sử dụng import.meta.env để đọc cấu hình từ file .env
const oidcConfig: AuthProviderProps = {
  authority: import.meta.env.VITE_AUTH_AUTHORITY, 
  client_id: import.meta.env.VITE_AUTH_CLIENT_ID,
  redirect_uri: window.location.origin,
  onSigninCallback: (user: User | void) => {
    if (user?.access_token) {
      localStorage.setItem('accessToken', user.access_token);
      // Xóa các params của OIDC trên URL sau khi login thành công để URL đẹp hơn
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  },
  // Tự động renew token khi hết hạn
  automaticSilentRenew: true,
};

export default function App() {
  // Log ra để kiểm tra xem đã nhận đúng biến môi trường chưa
  console.log('OIDC Config:', {
    authority: import.meta.env.VITE_AUTH_AUTHORITY,
    clientId: import.meta.env.VITE_AUTH_CLIENT_ID
  });

  return (
    <AuthProvider {...oidcConfig}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <RouterProvider router={router} />
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}