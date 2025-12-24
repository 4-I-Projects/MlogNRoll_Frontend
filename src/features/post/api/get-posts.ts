import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Post, Tag } from '../types';
import { User } from '@/features/auth/types';

export interface GetPostsParams {
  userId?: string;
  status?: 'published' | 'draft' | 'scheduled';
  q?: string;
}

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

// [FIX] Hàm map User nội bộ
export const mapUser = (data: any): User => ({
  id: String(data.id),
  username: data.username || 'unknown',
  email: data.email || '',
  firstName: data.first_name || '',
  lastName: data.last_name || '',
  displayName: data.display_name || data.username || 'Unknown',
  avatar: data.avatar_url || data.avatar || '',
  bio: data.bio || '',
  followersCount: data.followers_count || 0,
  followingCount: data.following_count || 0,
  isFollowing: data.is_following || false,
});

// [MỚI] Hàm tính thời gian đọc (Word count based)
const calculateReadTime = (content: string): number => {
  if (!content) return 1;
  // 1. Loại bỏ HTML tags để đếm nội dung thực
  const cleanText = content.replace(/<[^>]+>/g, ' ');
  // 2. Đếm số từ (tách theo khoảng trắng)
  const wordCount = cleanText.trim().split(/\s+/).length;
  // 3. Tốc độ đọc trung bình: 200 từ/phút
  const time = Math.ceil(wordCount / 200);
  // 4. Luôn trả về ít nhất 1 phút
  return time > 0 ? time : 1;
};

export const mapPostResponse = (post: PostResponse, userMap?: Map<string, User>): Post => {
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

  const author = userMap?.get(authorIdStr) || authorFallback;

  // Tạo excerpt từ body
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
    
    // [FIX] Sử dụng hàm tính toán mới thay vì hardcode hoặc chia length/1000
    readTime: calculateReadTime(post.body),
    
    stats: { likes: 0, comments: 0, views: 0 },
  };
};

export const getPosts = async (params?: GetPostsParams): Promise<Post[]> => {
  const response = await apiClient.get<PostResponse[]>('/posts');
  const rawData = response as any;
  let postsData: PostResponse[] = Array.isArray(rawData) ? rawData : (rawData.data || []);

  if (!Array.isArray(postsData) || postsData.length === 0) return [];

  // Client-side Filtering
  if (params) {
    if (params.userId) {
      postsData = postsData.filter(p => String(p.authorId) === params.userId);
    }
    if (params.status) {
      postsData = postsData.filter(p => p.status?.toUpperCase() === params.status?.toUpperCase());
    }
    if (params.q) {
      const query = params.q.toLowerCase();
      postsData = postsData.filter(p => 
        p.title?.toLowerCase().includes(query) || 
        p.body?.toLowerCase().includes(query)
      );
    }
  }

  // Client-side Aggregation
  const uniqueAuthorIds = [...new Set(postsData.map((p) => String(p.authorId)))];
  const userPromises = uniqueAuthorIds.map((id) => 
    apiClient.get(`/users/${id}`).then((res) => res as any).catch(() => null)
  );
  
  const usersRaw = await Promise.all(userPromises);
  const userMap = new Map<string, User>();
  usersRaw.forEach((u) => {
    if (u && u.id) userMap.set(String(u.id), mapUser(u));
  });

  return postsData.map(post => mapPostResponse(post, userMap));
};

export const usePosts = (params?: GetPostsParams) => {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: () => getPosts(params),
    enabled: params?.userId !== undefined ? !!params.userId : true,
  });
};