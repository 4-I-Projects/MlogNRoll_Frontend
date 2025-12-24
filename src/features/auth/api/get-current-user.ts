import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { User } from '../types';

// 1. Định nghĩa kiểu dữ liệu thô trả về từ Backend (khớp 100% với JSON Response)
interface UserResponse {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  display_name?: string; // Backend trả về snake_case
  bio?: string;
  avatar_url?: string;   // Backend trả về snake_case
  created_at?: string;
  updated_at?: string;
  followers_count?: number; // Dự phòng nếu backend trả về snake_case
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
    
    // [FIX 1] Map đúng key display_name -> displayName
    displayName: data.display_name || data.username, 
    
    // [FIX 2 - QUAN TRỌNG] Map avatar_url từ backend sang avatar của frontend
    avatar: data.avatar_url || '', 
    
    bio: data.bio || '',
    
    // Map các chỉ số (nếu backend chưa trả về thì để 0)
    followersCount: data.followers_count || 0,
    followingCount: data.following_count || 0,
    isFollowing: data.is_following || false,
  };
};

export const getCurrentUser = async (): Promise<User> => {
  // Gọi API
  const response = await apiClient.get('/users/me');
  
  // [FIX 3] Map dữ liệu trước khi trả về cho Hook
  // Ép kiểu response về UserResponse để TypeScript hiểu cấu trúc snake_case
  return mapUserResponse(response as unknown as UserResponse);
};

export const useCurrentUser = () => {
  return useQuery({
    // [FIX 4] Đổi key thành ['current-user'] để khớp với EditProfileDialog
    queryKey: ['current-user'], 
    queryFn: getCurrentUser,
    retry: false,
  });
};