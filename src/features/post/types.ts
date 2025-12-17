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
  
  // [SỬA 1] Đồng nhất tên gọi là 'content' (Backend Entity: content)
  content: string; 
  
  // [SỬA 2] Backend trả về 'userId', không trả về 'authorId' hay object 'author'
  userId: string; 
  
  // Trường này sẽ được Frontend tự điền sau khi gọi User Service (Optional)
  author?: User; 

  // [SỬA 3] Backend trả về mảng object Tag, không phải string[]
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
  authorId?: string; // Có thể optional nếu BE trả về object User lồng nhau
  author?: User;
  parentId: string | null;
  content: string;
  date: string; // hoặc createdAt
  likes: number; // hoặc likeCount
  isLiked?: boolean;
  replies?: Comment[];
}