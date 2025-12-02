import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { User } from '../types';

export const getCurrentUser = async (): Promise<User> => {
  return apiClient.get('/users/me');
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['users', 'me'],
    queryFn: getCurrentUser,
    retry: false, // Nếu lỗi (chưa login) thì không retry liên tục
  });
};