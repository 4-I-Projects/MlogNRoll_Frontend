// src/lib/mock-api.ts
import { mockPosts } from './mockData';
import { Post } from '@/features/post/types';
import { GetPostsParams } from '@/features/post/api/get-posts';

// Hàm giả lập độ trễ mạng (500ms - 1000ms)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  posts: {
    getAll: async (params?: GetPostsParams): Promise<Post[]> => {
      await delay(800); // Giả vờ load lâu một chút để test loading spinner

      let filteredPosts = [...mockPosts];

      if (params) {
        // 1. Lọc theo Author
        if (params.authorId) {
          filteredPosts = filteredPosts.filter(p => p.authorId === params.authorId);
        }

        // 2. Lọc theo trạng thái
        if (params.status) {
           filteredPosts = filteredPosts.filter(p => p.status === params.status);
        }

        // 3. Tìm kiếm (theo title hoặc excerpt)
        if (params.q) {
          const lowerQ = params.q.toLowerCase();
          filteredPosts = filteredPosts.filter(p => 
            p.title.toLowerCase().includes(lowerQ) || 
            p.excerpt.toLowerCase().includes(lowerQ)
          );
        }
        
        // 4. Các filter khác (Liked, Saved - Logic giả định)
        // Hiện tại mockPosts chưa có field isLiked/isSaved, ta có thể bỏ qua hoặc random
        if (params.isLiked) {
             // Logic giả: Trả về bài có ID chẵn
             filteredPosts = filteredPosts.filter((_, index) => index % 2 === 0);
        }
      }

      return filteredPosts;
    },
    
    // Thêm các hàm getOne, create, update giả ở đây sau này...
  }
};