import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Post, Tag } from '../types';
import { User } from '@/features/auth/types';
import { mapUserFromBE } from '@/features/auth/api/get-user';

export interface GetPostsParams {
  userId?: string;
  status?: 'published' | 'draft' | 'scheduled';
  q?: string;
}

interface PostDTO {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  thumbnail?: string;
  status: string;
  userId: string;
  tags: Tag[];
  categoryId?: string;
  createdAt: string;
  updatedAt: string;
}

export const getPosts = async (params?: GetPostsParams): Promise<Post[]> => {
  // 1. Gọi API Content Service
  // Ép kiểu 'as any' ở đây để tránh lỗi TS nếu interceptor trả về data trực tiếp
  const response = await apiClient.get<PostDTO[]>('/content/posts', {
    params: params 
  }) as any;
  
  // Xử lý linh hoạt: Nếu interceptor đã trả data thì dùng luôn, nếu chưa thì lấy .data
  const postsData = response.data || response;

  if (!Array.isArray(postsData)) {
    return [];
  }

  // 2. Client-side Aggregation (Lấy thông tin User)
  const uniqueUserIds = [...new Set(postsData.map((p: PostDTO) => p.userId))];
  
  const userPromises = uniqueUserIds.map((id) => 
    apiClient.get(`/users/${id}`)
      // [FIX LỖI QUAN TRỌNG] 
      // Ép kiểu 'res as any' để TS biết đây là object user (đã qua interceptor), 
      // không phải là AxiosResponse
      .then((res) => res as any) 
      .catch(() => null)
  );
  
  const usersRaw = await Promise.all(userPromises);
  
  // Map userId -> User Object
  const userMap = new Map();
  usersRaw.forEach((u) => {
    // [HẾT LỖI] Bây giờ 'u' là 'any', nên TS cho phép truy cập .id
    if (u && u.id) {
      userMap.set(u.id, mapUserFromBE(u));
    }
  });

  // 3. Map dữ liệu về Frontend Model
  return postsData.map((post: PostDTO) => {
    const author = userMap.get(post.userId) || {
      id: post.userId,
      username: 'unknown',
      displayName: 'Unknown User',
      avatar: '',
    } as User;

    return {
      id: post.id,
      title: post.title,
      excerpt: post.excerpt || '',
      content: post.content,
      userId: post.userId,
      author: author,
      datePublished: post.createdAt,
      status: post.status as any,
      tags: post.tags || [],
      thumbnail: post.thumbnail,
      readTime: 5, 
      stats: { likes: 0, comments: 0, views: 0 },
    };
  });
};

export const usePosts = (params?: GetPostsParams) => {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: () => getPosts(params),
  });
};