import { apiClient } from '@/lib/api-client';
import { Post } from '../types';

// Định nghĩa dữ liệu gửi lên Server (Payload)
export type CreatePostDTO = {
  title: string;
  content: string;         // Nội dung HTML từ Editor
  cover_image?: string;    // URL ảnh bìa (nếu có)
  tags?: string[];         // Mảng các tag
  status: 'published' | 'draft'; 
};

// Hàm gọi API POST /api/v1/posts
export const createPost = async (data: CreatePostDTO): Promise<Post> => {
  return apiClient.post('/posts', data);
};