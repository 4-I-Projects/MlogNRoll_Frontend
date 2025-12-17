import { User } from '@/features/auth/types';
import { Post, Comment, Tag } from '@/features/post/types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    username: 'sarah_c',
    email: 'sarah@example.com',
    firstName: 'Sarah',
    lastName: 'Chen',
    displayName: 'Sarah Chen', // [FIX] Chỉ dùng displayName, xóa field name
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop',
    bio: 'Tech writer sharing insights.',
    followingCount: 234,
    followersCount: 1520,
  },
  {
    id: 'user-2',
    username: 'alex_r',
    email: 'alex@example.com',
    firstName: 'Alex',
    lastName: 'Rivera',
    displayName: 'Alex Rivera',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    bio: 'UI/UX Designer.',
    followingCount: 156,
    followersCount: 892,
  },
];

export const currentUser: User = {
  id: 'current-user-id',
  username: 'thanhhuy',
  email: 'huy@example.com',
  firstName: 'Thanh',
  lastName: 'Huy',
  displayName: 'Thanh Huy',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CurrentUser',
  bio: 'Learning Microservices.',
  followingCount: 10,
  followersCount: 5,
};

// ... Các phần tags và mockPosts giữ nguyên (đã sửa ở bước trước) ...
// Nhớ đảm bảo mockPosts sử dụng userId thay vì authorId
const tags: Record<string, Tag> = {
  web: { id: 'tag-1', name: 'Web Development', slug: 'web-dev' },
  tech: { id: 'tag-2', name: 'Technology', slug: 'technology' },
  design: { id: 'tag-3', name: 'Design', slug: 'design' },
};

export const mockPosts: Post[] = [
  {
    id: 'post-1',
    title: 'The Future of Web Development',
    excerpt: 'Web development trends in 2025...',
    content: '<p>Full content goes here...</p>',
    userId: 'user-1', // userId chuẩn
    author: mockUsers[0],
    datePublished: '2025-11-05T10:00:00Z',
    status: 'published',
    tags: [tags.web, tags.tech],
    readTime: 5,
    stats: { likes: 342, comments: 28, views: 1850 },
    thumbnail: 'https://images.unsplash.com/photo-1623715537851-8bc15aa8c145?w=800&fit=crop',
  },
  // ...
];

export const mockComments: Comment[] = []; 
export function getPostById(id: string) { return mockPosts.find(p => p.id === id); }