import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Post, Tag } from '../types';
import { User } from '@/features/auth/types';

export interface GetPostsParams {
  userId?: string;
  status?: 'published' | 'draft' | 'scheduled';
  q?: string;
}

// Interface Response thô từ Backend (PostDTO)
export interface PostResponse {
  id: number | string;
  title: string;
  body: string;       // Backend trả về 'body'
  status: string;
  authorId?: string | number; // Backend trả về authorId
  author_id?: string | number; // Dự phòng trường hợp snake_case
  tags: Tag[];
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  publishedAt?: string;
  
  // Object author lồng nhau (nếu BE có trả về, hoặc do FE tự ghép vào)
  author?: {
    id: string;
    username: string;
    display_name?: string;
    avatar_url?: string; // Quan trọng: BE trả về avatar_url
    bio?: string;
  };
}

// [FIX] Hàm Map dùng chung: Chuyển đổi dữ liệu Backend -> Frontend
export const mapPostResponse = (data: PostResponse): Post => {
  // Ưu tiên lấy object author đã được ghép
  const authorData = data.author || {} as any;
  const authorId = String(data.authorId || data.author_id || '');

  const mappedAuthor: User = {
    id: authorData.id || authorId,
    username: authorData.username || 'unknown',
    email: '', 
    firstName: '', 
    lastName: '',
    displayName: authorData.display_name || authorData.username || 'Unknown',
    // [KEY FIX] Map avatar_url từ backend sang avatar của frontend
    avatar: authorData.avatar_url || authorData.avatar || '', 
    bio: authorData.bio || '',
  };

  return {
    id: String(data.id),
    title: data.title,
    content: data.body || '', // Map body -> content
    excerpt: data.body ? data.body.replace(/<[^>]+>/g, '').substring(0, 150) + '...' : '',
    userId: mappedAuthor.id,
    author: mappedAuthor,
    
    // Xử lý ngày tháng (hỗ trợ cả snake_case và camelCase)
    // Ưu tiên publishedAt nếu có
    datePublished: data.publishedAt || data.created_at || data.createdAt || new Date().toISOString(),
    
    status: (data.status?.toLowerCase() as any) || 'draft',
    readTime: Math.ceil((data.body?.length || 0) / 1000) || 5,
    stats: { likes: 0, comments: 0, views: 0 },
    tags: data.tags || [],
    thumbnail: undefined
  };
};

export const getPosts = async (params: any = {}): Promise<Post[]> => {
  // 1. Gọi API lấy danh sách bài viết
  const response = await apiClient.get<PostResponse[]>('/posts', { params });
  const rawData = response as any;
  const postsData = Array.isArray(rawData) ? rawData : (rawData.data || []);

  if (!Array.isArray(postsData) || postsData.length === 0) return [];

  // 2. [CLIENT-SIDE AGGREGATION] Lấy thông tin Author nếu bài viết thiếu object author
  // Lấy danh sách ID tác giả duy nhất
  const uniqueAuthorIds = [...new Set(postsData.map((p) => p.authorId || p.author_id).filter(Boolean))];
  
  if (uniqueAuthorIds.length > 0) {
    try {
      // Gọi API lấy thông tin từng user song song
      const userPromises = uniqueAuthorIds.map((id) => 
        apiClient.get(`/users/${id}`).catch(() => null)
      );
      
      const usersRaw = await Promise.all(userPromises);
      
      // Tạo Map để tra cứu nhanh: ID -> User Data
      const userMap = new Map();
      usersRaw.forEach((u: any) => {
        if (u && u.id) {
          userMap.set(String(u.id), u);
        }
      });

      // Ghép thông tin user vào từng bài viết
      postsData.forEach((post) => {
        const aId = String(post.authorId || post.author_id);
        if (userMap.has(aId)) {
          post.author = userMap.get(aId); // Gán raw user data vào field author
        }
      });
    } catch (error) {
      console.error("Failed to fetch authors for posts", error);
    }
  }

  // 3. Map dữ liệu hoàn chỉnh về Frontend Model
  return postsData.map(mapPostResponse);
};

export const usePosts = (params: any = {}) => {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: () => getPosts(params),
  });
};