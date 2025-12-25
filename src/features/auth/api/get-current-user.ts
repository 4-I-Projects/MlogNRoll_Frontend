import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { User } from '../types';

// 1. Định nghĩa kiểu dữ liệu thô trả về từ Backend
interface UserResponse {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  display_name?: string; 
  bio?: string;
  avatar_url?: string;   
  created_at?: string;
  updated_at?: string;
  followers_count?: number; 
  following_count?: number;
  is_following?: boolean;
}

// 2. Hàm Map từ Backend (Snake_case) sang Frontend (CamelCase)
const mapUserResponse = (data: UserResponse): User => {
  return {
    id: data.id,
    username: data.username,
    email: data.email,
    firstName: data.first_name || '',
    lastName: data.last_name || '',
    displayName: data.display_name || data.username, 
    avatar: data.avatar_url || '', 
    bio: data.bio || '',
    followersCount: data.followers_count || 0,
    followingCount: data.following_count || 0,
    isFollowing: data.is_following || false,
  };
};

export const getCurrentUser = async (): Promise<User> => {
  // Gọi API
  const response = await apiClient.get('/users/me');
  
  // Map dữ liệu trước khi trả về cho Hook
  return mapUserResponse(response as unknown as UserResponse);
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['current-user'], 
    queryFn: getCurrentUser,
    
    // [FIX QUAN TRỌNG: Cấu hình Retry để xử lý Race Condition]
    // Khi vừa login xong, Backend có thể chưa kịp sync user -> API trả về 404
    // Ta cấu hình retry để đợi một chút thay vì lỗi ngay lập tức.
    retry: (failureCount, error: any) => {
      // 1. Nếu lỗi 401 (Unauthorized - Token sai/hết hạn) -> Dừng ngay (để app logout)
      if (error?.response?.status === 401) return false;
      
      // 2. Nếu lỗi khác (thường là 404 Not Found do chưa sync kịp), thử lại tối đa 3 lần
      if (failureCount < 3) return true;
      
      // 3. Quá 3 lần vẫn lỗi -> Dừng (lúc này AppLayout sẽ hiện form hoàn tất profile)
      return false; 
    },
    
    // [FIX] Đợi 1000ms (1 giây) giữa các lần thử lại
    retryDelay: 1000, 
    
    // Tắt refetch khi focus để tránh spam request trong lúc đang retry
    refetchOnWindowFocus: false,
  });
};