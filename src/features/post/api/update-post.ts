import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface UpdatePostDTO {
  postId: string;
  data: {
    title?: string;
    body?: string;
    authorId?: string;
    // Status bắt buộc phải là 1 trong 3 giá trị này
    status?: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';
    categoryId?: number;
    // [FIX] Backend Tag ID là Long -> Frontend dùng number
    tagIds?: number[]; 
    mood?: string;
  }
}

export const updatePost = ({ postId, data }: UpdatePostDTO) => {
  return apiClient.patch(`/posts/${postId}`, data);
};

export const useUpdatePost = () => {
  return useMutation({
    mutationFn: updatePost,
  });
};