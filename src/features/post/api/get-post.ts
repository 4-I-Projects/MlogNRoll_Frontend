import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Post } from '../types';
import { mockPosts } from '@/lib/mockData'; // [MỚI] Import mock data

export const getPost = async (postId: string): Promise<Post> => {
  // --- MOCK MODE: Lấy từ dữ liệu giả ---
  // Tìm bài viết trong mockPosts
  const post = mockPosts.find((p) => p.id === postId);
  
  // Giả lập độ trễ mạng
  await new Promise(resolve => setTimeout(resolve, 500));

  if (!post) {
    throw new Error('Post not found');
  }
  
  return post;

  // --- REAL MODE (Comment lại để dùng sau) ---
  /*
  const response = await apiClient.get(`/content/posts/${postId}`);
  return response.data || response;
  */
};

export const usePost = (postId: string) => {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPost(postId),
    enabled: !!postId, // Chỉ chạy khi có postId
  });
};