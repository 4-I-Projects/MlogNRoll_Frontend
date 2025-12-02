import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Post } from '../types';

export const getPost = async (postId: string): Promise<Post> => {
  return apiClient.get(`/posts/${postId}`);
};

export const usePost = (postId: string) => {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPost(postId),
    enabled: !!postId, // Chỉ chạy khi có postId
  });
};