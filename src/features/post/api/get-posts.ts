import { apiClient } from '@/lib/api-client';
import { Post, Tag } from '../types';
import { User } from '@/features/auth/types';

// Định nghĩa Interface trả về từ Backend (Content Service)
// Khớp với file services/content/.../dtos/responses/PostResponseDTO.java
interface PostDTO {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  thumbnail?: string;
  status: string;
  userId: string; // Backend trả về userId
  tags: Tag[];    // Backend trả về mảng object Tag
  categoryId?: string;
  createdAt: string;
  updatedAt: string;
}

export const getPosts = async (): Promise<Post[]> => {
  // 1. Gọi Content Service lấy danh sách bài viết
  // Endpoint này dựa trên Content Controller
  const response = await apiClient.get<PostDTO[]>('/content/posts'); 
  
  // Xử lý trường hợp response có thể được bọc trong object data (tùy interceptor)
  const postsData = (response as any).data || response;

  if (!Array.isArray(postsData)) {
    console.error("API response is not an array", postsData);
    return [];
  }

  // 2. Trích xuất danh sách userId duy nhất để tránh gọi trùng lặp
  const uniqueUserIds = [...new Set(postsData.map((p) => p.userId))];

  // 3. Gọi User Service để lấy thông tin chi tiết (Client-side Aggregation)
  // Lưu ý: Nếu có API bulk get (/users?ids=...) thì tốt hơn, ở đây dùng Promise.all
  const userPromises = uniqueUserIds.map((id) => 
    apiClient.get<User>(`/users/${id}`).catch(() => null) // Catch lỗi để 1 user lỗi không làm hỏng cả trang
  );
  
  const users = await Promise.all(userPromises);
  
  // Tạo Map để tra cứu nhanh: userId -> User Object
  const userMap = new Map();
  users.forEach((user: any) => {
    if (user && user.id) {
      userMap.set(user.id, user);
    }
  });

  // 4. Map dữ liệu DTO sang Domain Model của Frontend
  return postsData.map((post) => {
    const author = userMap.get(post.userId) || {
      id: post.userId,
      username: 'unknown',
      displayName: 'Unknown User',
      name: 'Unknown',
      avatar: 'https://via.placeholder.com/150', // Avatar mặc định nếu không tìm thấy
    };

    return {
      id: post.id,
      title: post.title,
      excerpt: post.excerpt || '',
      content: post.content,
      userId: post.userId,
      author: author, // Đã ghép thông tin user
      datePublished: post.createdAt,
      status: post.status as any,
      tags: post.tags || [],
      thumbnail: post.thumbnail,
      readTime: 5, // Backend chưa tính, tạm để hardcode hoặc tính ở FE
      stats: { // Engagement Service chưa tích hợp vào list, tạm để 0
        likes: 0,
        comments: 0,
        views: 0,
      },
    };
  });
};