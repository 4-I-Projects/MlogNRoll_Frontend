import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { User } from '@/features/auth/types';
import { toast } from 'sonner';

// --- HELPER ---
const mapUserResponse = (data: any): User => ({
  id: String(data.id), // [FIX] Ép kiểu ID về string ngay từ đầu
  username: data.username,
  displayName: data.displayName || data.username,
  avatar: data.avatarUrl || data.avatar || '',
  email: data.email || '',
  firstName: data.firstName || '',
  lastName: data.lastName || '',
  bio: data.bio || '',
  followersCount: data.followersCount || 0,
  followingCount: data.following_count || data.followingCount || 0,
});

// --- API ACTIONS ---

export const followUser = (targetUserId: string) => {
  return apiClient.post(`/users/${targetUserId}/follow`, {});
};

export const unfollowUser = (targetUserId: string) => {
  return apiClient.delete(`/users/${targetUserId}/follow`);
};

export const getFollowing = async (userId: string): Promise<User[]> => {
  if (!userId) return []; // Guard clause
  try {
    const response = await apiClient.get<any>(`/users/${userId}/following`);
    const list = (response as any).data || response || [];
    return Array.isArray(list) ? list.map(mapUserResponse) : [];
  } catch (e) {
    return [];
  }
};

export const getFollowers = async (userId: string): Promise<User[]> => {
  if (!userId) return [];
  try {
    const response = await apiClient.get<any>(`/users/${userId}/followers`);
    const list = (response as any).data || response || [];
    return Array.isArray(list) ? list.map(mapUserResponse) : [];
  } catch (e) {
    return [];
  }
};

export const getAllUsers = async (): Promise<User[]> => {
    try {
      // [DEBUG] Log để kiểm tra API users có chạy không
      console.log('Fetching all users for search...');
      const response = await apiClient.get<any>('/users');
      const list = (response as any).data || response || [];
      return Array.isArray(list) ? list.map(mapUserResponse) : [];
    } catch (error) { 
      console.error("API /users failed:", error);
      return []; 
    }
};

// --- HOOKS ---

export const useFollowing = (userId: string) => {
  return useQuery({
    queryKey: ['following', userId],
    queryFn: () => getFollowing(userId),
    enabled: !!userId,
    // [FIX] Bỏ staleTime: 0 để tránh fetch liên tục, dùng refetchOnMount thay thế
    refetchOnMount: 'always', 
  });
};

export const useFollowers = (userId: string) => {
  return useQuery({
    queryKey: ['followers', userId],
    queryFn: () => getFollowers(userId),
    enabled: !!userId,
  });
};

export const useAllUsers = () => {
    return useQuery({
      queryKey: ['users', 'all'],
      queryFn: getAllUsers,
      staleTime: 1000 * 60 * 5, // Cache 5p
    });
};

// --- MUTATIONS ---

export const useFollowUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: followUser,
    onSuccess: () => {
      // Invalidate tất cả các key liên quan để UI cập nhật toàn bộ
      queryClient.invalidateQueries({ queryKey: ['following'] });
      queryClient.invalidateQueries({ queryKey: ['followers'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => toast.error('Lỗi khi theo dõi người dùng.')
  });
};

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unfollowUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['following'] });
      queryClient.invalidateQueries({ queryKey: ['followers'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => toast.error('Lỗi khi hủy theo dõi.')
  });
};