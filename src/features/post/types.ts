import { User } from '../auth/types';

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface PostStats {
  likes: number;
  comments: number;
  views: number;
}

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string; 
  userId: string; 
  author?: User; 
  tags: Tag[]; 
  
  // [MỚI] Thêm trường mood
  mood?: string; 
  
  datePublished: string;
  status: 'draft' | 'published' | 'unlisted' | 'scheduled';
  readTime: number;
  stats: PostStats;
  thumbnail?: string;
  coverImage?: string;
  series?: string;
  
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  author?: User;
  parentId: string | null;
  content: string;
  date: string;
  likes: number;
  isLiked?: boolean;
  replies?: Comment[];
}