import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { User } from '../types';

// Định nghĩa cấu trúc trả về từ API Follows của Backend
export interface FollowListResponse {
  data: User[];
  meta: {
    page: number;
    limit: number;
    total: number; // Trường quan trọng để lấy số lượng
    totalPages: number;
  };
}

// Hàm lấy số lượng Followers và Following
export const getUserFollowCounts = async (userId: string) => {
  try {
    // Gọi song song 2 API với limit=1 để tối ưu hiệu năng
    const [followersRes, followingRes] = await Promise.all([
      apiClient.get<FollowListResponse>(`/follows/followers/${userId}?page=1&limit=1`),
      apiClient.get<FollowListResponse>(`/follows/following/${userId}?page=1&limit=1`)
    ]);

    return {
      // Ép kiểu an toàn hoặc dùng optional chaining
      followersCount: (followersRes as any)?.meta?.total || 0,
      followingCount: (followingRes as any)?.meta?.total || 0
    };
  } catch (error) {
    console.error("Failed to fetch follow counts:", error);
    return { followersCount: 0, followingCount: 0 };
  }
};

// Hàm lấy danh sách Followers
export const getFollowers = async (userId: string): Promise<FollowListResponse> => {
  return apiClient.get(`/follows/followers/${userId}`);
};

// Hàm lấy danh sách Following
export const getFollowing = async (userId: string): Promise<FollowListResponse> => {
  return apiClient.get(`/follows/following/${userId}`);
};

// Hook lấy danh sách Followers
export const useFollowers = (userId: string) => {
  return useQuery({
    queryKey: ['users', userId, 'followers'],
    queryFn: () => getFollowers(userId),
    enabled: !!userId,
  });
};

// Hook lấy danh sách Following
export const useFollowing = (userId: string) => {
  return useQuery({
    queryKey: ['users', userId, 'following'],
    queryFn: () => getFollowing(userId),
    enabled: !!userId,
  });
};