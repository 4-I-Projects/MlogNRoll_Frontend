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

// [QUAN TRỌNG] Interface này phải khớp 100% với PostResponse.java ở Backend
// Backend: Long id, String title, String body, Long authorId, ...
interface PostDTO {
  id: number;          // Backend đang trả về Long
  title: string;
  body: string;        // Backend dùng 'body', không phải 'content'
  status: string;      // Backend thường trả về UPPERCASE (PUBLISHED)
  authorId: string | number; // Backend trả về authorId. Để string | number để an toàn khi bạn đổi DB
  tags: Tag[];
  category?: {         // Backend trả về object category
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export const getPosts = async (params?: GetPostsParams): Promise<Post[]> => {
  // 1. Gọi API Content Service
  // Lưu ý: Đường dẫn '/content/posts' giả định bạn đã config Gateway trỏ vào Content Service
  // Nếu Gateway map '/api/v1/posts' thẳng vào content-service, bạn có thể chỉ cần gọi '/posts'
  const response = await apiClient.get<PostDTO[]>('/posts', {
    params: params 
  });

  // Xử lý linh hoạt dữ liệu trả về từ Axios Interceptor
  // Ép kiểu 'unknown' trước khi 'as any' để tránh lỗi eslint nếu có, 
  // hoặc check kỹ xem interceptor của bạn trả về data hay response object
  const rawData = response as any;
  const postsData: PostDTO[] = Array.isArray(rawData) ? rawData : (rawData.data || []);

  if (!Array.isArray(postsData) || postsData.length === 0) {
    return [];
  }

  // 2. Client-side Aggregation (Lấy thông tin User)
  // Lấy danh sách authorId duy nhất từ bài viết
  const uniqueAuthorIds = [...new Set(postsData.map((p) => p.authorId))];
  
  const userPromises = uniqueAuthorIds.map((id) => 
    apiClient.get(`/users/${id}`)
      .then((res) => res as any) 
      .catch(() => null)
  );
  
  const usersRaw = await Promise.all(userPromises);
  
  // Map authorId -> User Object
  const userMap = new Map<string | number, User>();
  usersRaw.forEach((u) => {
    if (u && u.id) {
      userMap.set(u.id, mapUserFromBE(u));
    }
  });

  // 3. Map dữ liệu Backend về Frontend Model
  return postsData.map((post) => {
    // Tìm user trong map, nếu không thấy thì dùng fallback
    const author = userMap.get(post.authorId) || {
      id: String(post.authorId),
      username: 'unknown',
      displayName: 'Unknown User',
      avatar: '',
      bio: '',
    } as User;

    // Tự động tạo đoạn trích (excerpt) từ body nếu backend không gửi về
    const generatedExcerpt = post.body 
      ? post.body.substring(0, 150) + (post.body.length > 150 ? '...' : '') 
      : '';

    return {
      id: String(post.id), // FE thường dùng string cho ID để thống nhất
      title: post.title,
      // Map 'body' của BE sang 'content' của FE
      content: post.body, 
      excerpt: generatedExcerpt,
      userId: String(post.authorId),
      author: author,
      // Ưu tiên dùng publishedAt cho ngày hiển thị, nếu không có thì dùng createdAt
      datePublished: post.publishedAt || post.createdAt,
      // Chuyển status từ UPPERCASE (BE) sang lowercase (FE) nếu cần
      status: (post.status ? post.status.toLowerCase() : 'draft') as any,
      tags: post.tags || [],
      thumbnail: undefined, // Backend hiện tại chưa thấy trả về thumbnail
      readTime: Math.ceil((post.body?.length || 0) / 1000) || 5, // Tính giả định thời gian đọc
      stats: { likes: 0, comments: 0, views: 0 }, // Engagement service chưa kết nối
    };
  });
};

export const usePosts = (params?: GetPostsParams) => {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: () => getPosts(params),
  });
};