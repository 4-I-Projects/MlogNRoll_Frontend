import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { User } from '../types';

// Hàm xử lý dữ liệu thô từ Backend thành User chuẩn cho Frontend
// (Ghép tên, tạo avatar mặc định nếu thiếu)
export const mapUserFromBE = (data: any): User => {
  if (!data) return data;
  
  const firstName = data.firstName || '';
  const lastName = data.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim();

  return {
    ...data,
    firstName: firstName,
    lastName: lastName,
    // Ưu tiên displayName ghép từ họ tên, nếu không có thì dùng username
    displayName: fullName || data.username || 'Unknown User',
    
    // Avatar placeholder nếu BE trả về null
    avatar: data.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || data.username)}&background=random&color=fff`,
    
    // Bio mặc định
    bio: data.bio || `Thành viên của Mlog.`,
  };
};

// Gọi API lấy chi tiết 1 user
export const getUser = async (userId: string): Promise<User> => {
  const response = await apiClient.get<any>(`/users/${userId}`);
  // Map dữ liệu trước khi trả về cho Component dùng
  return mapUserFromBE(response);
};

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => getUser(userId),
    enabled: !!userId,
  });
};