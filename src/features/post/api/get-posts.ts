import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Post, Tag } from '../types';
import { User } from '@/features/auth/types';

export interface GetPostsParams {
  userId?: string;
  status?: 'published' | 'draft' | 'scheduled';
  q?: string;
}

// Interface Response thô từ Backend
export interface PostResponse {
  id: number | string;
  title: string;
  body: string;
  status: string;
  authorId: string | number;
  tags: Tag[];
  category?: {
    id: number;
    name: string;
  };
  mood?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

// [FIX] Hàm map User nội bộ để đảm bảo map đúng avatar_url -> avatar
export const mapUser = (data: any): User => ({
  id: String(data.id),
  username: data.username || 'unknown',
  email: data.email || '',
  firstName: data.first_name || '',
  lastName: data.last_name || '',
  displayName: data.display_name || data.username || 'Unknown',
  avatar: data.avatar_url || data.avatar || '', // Ưu tiên avatar_url từ BE
  bio: data.bio || '',
  followersCount: data.followers_count || 0,
  followingCount: data.following_count || 0,
  isFollowing: data.is_following || false,
});

// [FIX] Hàm Map Post dùng chung
export const mapPostResponse = (post: PostResponse, userMap?: Map<string, User>): Post => {
  // [QUAN TRỌNG] Ép kiểu authorId về string để tìm trong Map
  const authorIdStr = String(post.authorId);
  
  const authorFallback: User = {
    id: authorIdStr,
    username: 'unknown',
    displayName: 'Unknown User',
    avatar: '',
    bio: '',
    firstName: '',
    lastName: '',
    email: '',
    followersCount: 0,
    followingCount: 0,
    isFollowing: false
  };

  // Tìm user trong map
  const author = userMap?.get(authorIdStr) || authorFallback;

  const generatedExcerpt = post.body 
    ? post.body.replace(/<[^>]+>/g, '').substring(0, 150) + (post.body.length > 150 ? '...' : '') 
    : '';

  return {
    id: String(post.id),
    title: post.title,
    content: post.body, 
    excerpt: generatedExcerpt,
    userId: authorIdStr,
    author: author,
    mood: post.mood || undefined,
    datePublished: post.publishedAt || post.createdAt,
    status: (post.status ? post.status.toLowerCase() : 'draft') as any,
    tags: post.tags || [],
    thumbnail: undefined,
    readTime: Math.ceil((post.body?.length || 0) / 1000) || 5,
    stats: { likes: 0, comments: 0, views: 0 },
  };
};

export const getPosts = async (params?: GetPostsParams): Promise<Post[]> => {
  // 1. Gọi API lấy TOÀN BỘ bài viết (Không truyền params lọc lên server vì server chưa hỗ trợ)
  const response = await apiClient.get<PostResponse[]>('/posts');

  const rawData = response as any;
  let postsData: PostResponse[] = Array.isArray(rawData) ? rawData : (rawData.data || []);

  if (!Array.isArray(postsData) || postsData.length === 0) {
    return [];
  }

  // 2. [CLIENT-SIDE FILTERING] Lọc dữ liệu ngay tại Frontend
  if (params) {
    // Lọc theo User ID (cho trang Stories/Profile)
    if (params.userId) {
      postsData = postsData.filter(p => String(p.authorId) === params.userId);
    }

    // Lọc theo Status (cho trang Home/Stories)
    if (params.status) {
      postsData = postsData.filter(p => p.status?.toUpperCase() === params.status?.toUpperCase());
    }

    // Lọc theo Search Query
    if (params.q) {
      const query = params.q.toLowerCase();
      postsData = postsData.filter(p => 
        p.title?.toLowerCase().includes(query) || 
        p.body?.toLowerCase().includes(query)
      );
    }
  }

  // 3. Client-side Aggregation (Lấy thông tin User)
  const uniqueAuthorIds = [...new Set(postsData.map((p) => String(p.authorId)))];
  
  const userPromises = uniqueAuthorIds.map((id) => 
    apiClient.get(`/users/${id}`).then((res) => res as any).catch(() => null)
  );
  
  const usersRaw = await Promise.all(userPromises);
  const userMap = new Map<string, User>();
  
  usersRaw.forEach((u) => {
    if (u && u.id) {
      // Dùng hàm mapUser đã định nghĩa ở trên
      userMap.set(String(u.id), mapUser(u));
    }
  });

  return postsData.map(post => mapPostResponse(post, userMap));
};

export const usePosts = (params?: GetPostsParams) => {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: () => getPosts(params),
    // Chỉ fetch khi userId khác undefined (nếu params có userId). Nếu không có userId (Home), luôn fetch.
    enabled: params?.userId !== undefined ? !!params.userId : true,
  });
};