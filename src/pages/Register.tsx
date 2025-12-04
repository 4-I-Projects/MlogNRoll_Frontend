import { useEffect, useRef } from 'react'; // [MỚI] Thêm useRef
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';

export function Register() {
  const auth = useAuth();
  const navigate = useNavigate();
  const hasRedirected = useRef(false); // [MỚI] Cờ kiểm tra

  useEffect(() => {
    // Nếu đã login hoặc đã gọi redirect rồi thì thôi
    if (auth.isAuthenticated) {
      navigate('/');
      return;
    }
    
    if (hasRedirected.current) return; // [MỚI] Chặn gọi lần 2

    // Đánh dấu là đã gọi
    hasRedirected.current = true; 

    void auth.signinRedirect({
      prompt: 'create', 
      extraQueryParams: {
        kc_action: 'register'
      }
    }).catch((err) => {
        console.error("Register redirect error:", err);
        hasRedirected.current = false; // Reset nếu lỗi để user thử lại
    });

  }, [auth, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Redirecting to Registration...</p>
    </div>
  );
}