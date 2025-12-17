import { User } from '@/features/auth/types';
import { Post, Comment, Tag } from '@/features/post/types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    username: 'sarah_c',
    displayName: 'Sarah Chen',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop',
    bio: 'Tech writer sharing insights.',
    followingCount: 234,
    followersCount: 1520,
  },
  {
    id: 'user-2',
    username: 'alex_r',
    displayName: 'Alex Rivera',
    name: 'Alex Rivera',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    bio: 'UI/UX Designer.',
    followingCount: 156,
    followersCount: 892,
  },
];

export const currentUser: User = {
  id: 'current-user-id',
  username: 'thanhhuy',
  displayName: 'Thanh Huy',
  name: 'Thanh Huy',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CurrentUser',
  bio: 'Learning Microservices.',
  followingCount: 10,
  followersCount: 5,
};

// Mock Tags (Object, không phải string)
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
    userId: 'user-1', // Dùng userId thay vì authorId
    author: mockUsers[0],
    datePublished: '2025-11-05T10:00:00Z',
    status: 'published',
    tags: [tags.web, tags.tech], // Mảng object Tag
    readTime: 5,
    stats: { likes: 342, comments: 28, views: 1850 },
    thumbnail: 'https://images.unsplash.com/photo-1623715537851-8bc15aa8c145?w=800&fit=crop',
  },
  {
    id: 'post-2',
    title: 'Designing for Accessibility',
    excerpt: 'Why accessibility matters...',
    content: '<p>Accessibility content...</p>',
    userId: 'user-2',
    author: mockUsers[1],
    datePublished: '2025-11-03T09:00:00Z',
    status: 'published',
    tags: [tags.design],
    readTime: 8,
    stats: { likes: 150, comments: 12, views: 900 },
    thumbnail: 'https://images.unsplash.com/photo-1617634667039-8e4cb277ab46?w=800&fit=crop',
  },
];

// Giữ lại các helper function
export const mockComments: Comment[] = []; // Tạm để trống hoặc thêm theo cấu trúc mới
export function getPostById(id: string) { return mockPosts.find(p => p.id === id); }