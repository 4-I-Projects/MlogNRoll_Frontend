import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export const deletePost = (postId: string) => {
  return apiClient.delete(`/posts/${postId}`);
};

export const useDeletePost = () => {
  return useMutation({
    mutationFn: deletePost,
  });
};