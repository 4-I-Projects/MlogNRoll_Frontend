import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Post } from '../types';
import { mapPostResponse, PostResponse } from './get-posts'; // Import hàm map và type

export const getPost = async (postId: string): Promise<Post> => {
  // 1. Gọi API lấy chi tiết bài viết
  // [FIX] Thêm 'as unknown as PostResponse' để báo cho TypeScript biết 
  // đây là dữ liệu thô (data), không phải AxiosResponse wrapper.
  const postRes = await apiClient.get<PostResponse>(`/posts/${postId}`) as unknown as PostResponse;
  
  // 2. Kiểm tra nếu thiếu thông tin author nhưng có authorId -> Gọi thêm API User
  if (!postRes.author && (postRes.authorId || postRes.author_id)) {
    const authorId = postRes.authorId || postRes.author_id;
    try {
      // Gọi API lấy thông tin User
      // Cũng ép kiểu về any hoặc User type để tránh lỗi tương tự
      const userRes = await apiClient.get<any>(`/users/${authorId}`) as any;
      
      // 3. Ghép thông tin User vào bài viết
      postRes.author = userRes; 
    } catch (error) {
      console.warn(`Could not fetch author details for post ${postId}`, error);
    }
  }
  
  // 4. Map dữ liệu đã ghép về format chuẩn của Frontend
  return mapPostResponse(postRes);
};

export const usePost = (postId: string) => {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPost(postId),
    enabled: !!postId,
    retry: 1,
  });
};