import { User } from '../auth/types'; // Import User từ auth

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
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author?: User;
  parentId: string | null;
  content: string;
  date: string;
  likes: number;
  isLiked?: boolean;
  replies?: Comment[];
}