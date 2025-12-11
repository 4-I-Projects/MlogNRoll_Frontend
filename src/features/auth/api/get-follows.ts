import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { User } from '../types';

interface UserListResponse {
  data: User[];
  meta: { total: number; page: number; limit: number };
}

export const getFollowers = async (userId: string): Promise<UserListResponse> => {
  return apiClient.get(`/users/${userId}/followers`);
};

export const getFollowing = async (userId: string): Promise<UserListResponse> => {
  return apiClient.get(`/users/${userId}/following`);
};

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