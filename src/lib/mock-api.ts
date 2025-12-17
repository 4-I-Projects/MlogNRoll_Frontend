import { mockPosts } from './mockData';
import { Post } from '@/features/post/types';

// [FIX] Định nghĩa interface này tại đây để tránh lỗi import nếu file get-posts.ts chưa export
export interface GetPostsParams {
  userId?: string; // [FIX] Đổi authorId -> userId
  status?: string;
  q?: string;
  isLiked?: boolean;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  posts: {
    getAll: async (params?: GetPostsParams): Promise<Post[]> => {
      await delay(800);

      let filteredPosts = [...mockPosts];

      if (params) {
        // [FIX] Lọc theo userId (trước là authorId)
        if (params.userId) {
          filteredPosts = filteredPosts.filter(p => p.userId === params.userId);
        }

        if (params.status) {
           filteredPosts = filteredPosts.filter(p => p.status === params.status);
        }

        if (params.q) {
          const lowerQ = params.q.toLowerCase();
          filteredPosts = filteredPosts.filter(p => 
            p.title.toLowerCase().includes(lowerQ) || 
            p.excerpt.toLowerCase().includes(lowerQ)
          );
        }
        
        if (params.isLiked) {
             filteredPosts = filteredPosts.filter((_, index) => index % 2 === 0);
        }
      }

      return filteredPosts;
    },
  }
};