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

const oidcConfig: AuthProviderProps = {
  authority: 'http://localhost:8080/realms/mlognroll', 
  client_id: 'mlognroll-frontend',
  redirect_uri: window.location.origin,
  onSigninCallback: (user: User | void) => {
    if (user?.access_token) {
      localStorage.setItem('accessToken', user.access_token);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  },
  automaticSilentRenew: true,
};

export default function App() {
  return (
    <AuthProvider {...oidcConfig}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}