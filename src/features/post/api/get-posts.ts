import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Post } from '../types';

export interface GetPostsParams {
  q?: string;
  authorId?: string;
  status?: string;
  // [MỚI] Thêm các param lọc tương tác
  isSaved?: boolean;
  isLiked?: boolean;
}

export const getPosts = async (params?: GetPostsParams): Promise<Post[]> => {
  return apiClient.get('/posts', { params });
};

export const usePosts = (params: GetPostsParams) => {
  return useQuery({
    // Thêm params vào queryKey để khi tab thay đổi (VD: Saved -> Favorites), nó sẽ fetch lại
    queryKey: ['posts', params], 
    queryFn: () => getPosts(params),
  });
};