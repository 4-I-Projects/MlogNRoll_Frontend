// src/features/post/api/get-posts.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Post } from '../types';
import { mockApi } from '@/lib/mock-api'; // Import Mock API

// CỜ CHUYỂN ĐỔI: Đặt true để dùng Mock, false để dùng Backend thật
const USE_MOCK_DATA = true; 

export interface GetPostsParams {
  q?: string;
  authorId?: string;
  status?: string;
  isSaved?: boolean;
  isLiked?: boolean;
}

export const getPosts = async (params?: GetPostsParams): Promise<Post[]> => {
  if (USE_MOCK_DATA) {
    console.log("⚠️ Using Mock Data for Posts");
    return mockApi.posts.getAll(params);
  }
  
  return apiClient.get('/posts', { params });
};

export const usePosts = (params: GetPostsParams) => {
  return useQuery({
    queryKey: ['posts', params], 
    queryFn: () => getPosts(params),
    placeholderData: (previousData) => previousData, 
  });
};