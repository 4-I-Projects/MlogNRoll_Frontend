import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Post } from '../types';
// [FIX] Import mapUser và mapPostResponse
import { mapPostResponse, mapUser, PostResponse } from './get-posts';
import { User } from '@/features/auth/types';

export const getPost = async (postId: string): Promise<Post> => {
  // 1. Gọi API lấy chi tiết bài viết
  const postRes = await apiClient.get<PostResponse>(`/posts/${postId}`) as unknown as PostResponse;
  
  // 2. Fetch thông tin Author
  const userMap = new Map<string, User>();
  
  if (postRes.authorId) {
    try {
      const userRes = await apiClient.get<any>(`/users/${postRes.authorId}`);
      // [FIX] Dùng mapUser chung và ép kiểu ID về string
      userMap.set(String(postRes.authorId), mapUser(userRes));
    } catch (error) {
      console.warn(`Could not fetch author details for post ${postId}`, error);
    }
  }
  
  // 3. Map dữ liệu
  return mapPostResponse(postRes, userMap);
};

export const usePost = (postId: string) => {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPost(postId),
    enabled: !!postId,
    retry: 1,
  });
};