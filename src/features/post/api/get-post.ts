import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Post } from '../types';

// Hàm gọi API lấy chi tiết 1 bài viết từ Backend
export const getPost = async (postId: string): Promise<Post> => {
  // [REAL MODE] Gọi API thật
  // Giả định đường dẫn API của bạn là /api/v1/posts/{id}
  // apiClient đã được cấu hình baseURL, nên chỉ cần gọi endpoint đuôi
  return apiClient.get(`/posts/${postId}`);
};

export const usePost = (postId: string) => {
  return useQuery({
    queryKey: ['post', postId], // Cache key: post + id
    queryFn: () => getPost(postId),
    enabled: !!postId, // Chỉ gọi API khi có postId
    retry: 1, // Thử lại 1 lần nếu mạng lỗi, sau đó fail luôn để hiện 404
  });
};