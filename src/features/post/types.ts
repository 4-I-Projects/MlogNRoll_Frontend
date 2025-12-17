import { User } from '../auth/types';

// [MỚI] Định nghĩa interface Tag khớp với TagResponseDTO của Backend
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
  
  datePublished: string; // Backend trả về createdAt/updatedAt, cần map sang
  status: 'draft' | 'published' | 'unlisted' | 'scheduled';
  readTime: number;
  stats: PostStats;
  thumbnail?: string;
  coverImage?: string; // Nếu BE có trường này
  series?: string;
  
  // Các trường trạng thái từ API tương tác (nếu có)
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
  date: string; // hoặc createdAt
  likes: number; // hoặc likeCount
  isLiked?: boolean;
  replies?: Comment[];
}