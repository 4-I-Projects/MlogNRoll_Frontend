import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Nếu đã login rồi thì đá về Home
    if (auth.isAuthenticated) {
      navigate('/');
    } else {
      // Nếu chưa, chuyển hướng sang Keycloak
      // Dùng void để tránh warning promise
      void auth.signinRedirect();
    }
  }, [auth.isAuthenticated, auth.signinRedirect, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Redirecting to Login...</p>
    </div>
  );
}