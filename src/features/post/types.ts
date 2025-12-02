import { User } from '../auth/types';

export interface PostStats {
  likes: number;
  comments: number;
  views: number;
}

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  contentHTML: string;
  authorId: string;
  author?: User;
  datePublished: string;
  status: 'draft' | 'published' | 'unlisted' | 'scheduled';
  tags: string[];
  readTime: number;
  stats: PostStats;
  thumbnail?: string;
  series?: string;
  
  // [MỚI] Thêm các trường trạng thái từ API
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  authorId?: string; // Có thể optional nếu BE trả về object User lồng nhau
  author?: User;
  parentId: string | null;
  content: string;
  date: string; // hoặc createdAt
  likes: number; // hoặc likeCount
  isLiked?: boolean;
  replies?: Comment[];
}