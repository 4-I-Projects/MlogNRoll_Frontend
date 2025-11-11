export interface User {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  followingCount: number;
  followersCount: number;
  isFollowing?: boolean;
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

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  message: string;
  read: boolean;
  date: string;
  userId: string;
  postId?: string;
}

export type Page = 
  | 'home' 
  | 'post-detail' 
  | 'editor' 
  | 'library' 
  | 'stories' 
  | 'profile' 
  | 'following'
  | 'settings'
  | 'login'
  | 'register';

export interface AppState {
  currentPage: Page;
  currentPostId?: string;
  sidebarOpen: boolean;
  currentUser: User;
  notifications: Notification[];
}
