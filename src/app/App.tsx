import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, AuthProviderProps } from 'react-oidc-context'; // [MỚI]
import { router } from './routes';
import { Toaster } from '@/ui/sonner';
import { User } from 'oidc-client-ts'; // [MỚI]

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// [MỚI] Cấu hình Keycloak OIDC
const oidcConfig: AuthProviderProps = {
  authority: 'http://localhost:8080/realms/mlognroll', // URL Realm của bạn
  client_id: 'mlognroll-frontend', // Client ID bạn đã tạo
  redirect_uri: window.location.origin, // http://localhost:3000
  onSigninCallback: (user: User | void) => {
    // Khi login thành công, lưu token và xóa query params trên URL cho sạch
    if (user?.access_token) {
      // Lưu token vào localStorage để API Client dùng
      localStorage.setItem('accessToken', user.access_token);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  },
  // Tự động refresh token khi hết hạn
  automaticSilentRenew: true,
};

export default function App() {
  return (
    // [MỚI] Bọc AuthProvider ra ngoài cùng
    <AuthProvider {...oidcConfig}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}