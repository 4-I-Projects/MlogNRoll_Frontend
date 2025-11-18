import { User } from '@/features/auth/types';
import { Post, Comment } from '@/features/post/types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop',
    bio: 'Tech writer, software engineer, and coffee enthusiast. Sharing insights on web development and design.',
    followingCount: 234,
    followersCount: 1520,
    isFollowing: false,
  },
  {
    id: '2',
    name: 'Alex Rivera',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    bio: 'UI/UX Designer crafting beautiful digital experiences. Passionate about accessibility and user research.',
    followingCount: 156,
    followersCount: 892,
    isFollowing: true,
  },
  {
    id: '3',
    name: 'Minh Nguyen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Minh',
    bio: 'Full-stack developer. Open source contributor. Building the future of web.',
    followingCount: 89,
    followersCount: 456,
    isFollowing: true,
  },
  {
    id: '4',
    name: 'Emma Thompson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    bio: 'Product designer with a love for minimalism and thoughtful interfaces.',
    followingCount: 312,
    followersCount: 2100,
    isFollowing: false,
  },
];

export const currentUser: User = {
  id: 'current-user',
  name: 'You',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CurrentUser',
  bio: 'Passionate writer and learner',
  followingCount: 45,
  followersCount: 123,
};

export const mockPosts: Post[] = [
  {
    id: '1',
    title: 'The Future of Web Development: What to Expect in 2025',
    excerpt: 'As we move deeper into 2025, the web development landscape continues to evolve at a breakneck pace. From AI-powered development tools to the rise of edge computing...',
    contentHTML: `
      <p>As we move deeper into 2025, the web development landscape continues to evolve at a breakneck pace. From AI-powered development tools to the rise of edge computing, developers are witnessing a transformation that's reshaping how we build for the web.</p>
      
      <h2>The Rise of AI-Assisted Development</h2>
      <p>One of the most significant trends is the integration of AI into our daily development workflows. Tools that understand context, suggest optimizations, and even write boilerplate code are becoming indispensable.</p>
      
      <h2>Edge Computing Goes Mainstream</h2>
      <p>Edge computing is no longer a futuristic concept. With major platforms offering edge runtime capabilities, developers can now run their code closer to users, dramatically improving performance and user experience.</p>
      
      <h2>The Component Era</h2>
      <p>Components have become the fundamental building blocks of modern web applications. Frameworks are converging on similar patterns, making it easier to share code and knowledge across ecosystems.</p>
      
      <p>The future is bright, and the possibilities are endless. What are you most excited about?</p>
    `,
    authorId: '1',
    author: mockUsers[0],
    datePublished: '2025-11-05',
    status: 'published',
    tags: ['Web Development', 'Technology', 'Future'],
    readTime: 5,
    stats: { likes: 342, comments: 28, views: 1850 },
    thumbnail: 'https://images.unsplash.com/photo-1623715537851-8bc15aa8c145?w=800&h=400&fit=crop',
    series: 'Web Development Series',
  },
  {
    id: '2',
    title: 'Designing for Accessibility: A Complete Guide',
    excerpt: 'Accessibility isn\'t just a nice-to-have feature—it\'s essential for creating inclusive digital experiences. Learn how to design and build products that work for everyone...',
    contentHTML: `
      <p>Accessibility isn't just a nice-to-have feature—it's essential for creating inclusive digital experiences. In this guide, we'll explore practical strategies for making your designs accessible to all users.</p>
      
      <h2>Understanding WCAG Guidelines</h2>
      <p>The Web Content Accessibility Guidelines (WCAG) provide a comprehensive framework for web accessibility. Understanding these principles is the first step toward creating inclusive designs.</p>
      
      <h2>Color Contrast and Typography</h2>
      <p>Proper color contrast ratios and readable typography are fundamental to accessibility. Always test your designs with various vision conditions in mind.</p>
      
      <h2>Keyboard Navigation</h2>
      <p>Not everyone uses a mouse. Ensuring your interface is fully navigable via keyboard is crucial for users with motor disabilities and power users alike.</p>
      
      <p>Remember: accessibility benefits everyone, not just users with disabilities.</p>
    `,
    authorId: '2',
    author: mockUsers[1],
    datePublished: '2025-11-03',
    status: 'published',
    tags: ['Design', 'Accessibility', 'UX'],
    readTime: 8,
    stats: { likes: 567, comments: 42, views: 2340 },
    thumbnail: 'https://images.unsplash.com/photo-1617634667039-8e4cb277ab46?w=800&h=400&fit=crop',
  },
  {
    id: '3',
    title: 'Building Scalable React Applications',
    excerpt: 'Scalability is about more than just handling lots of users. It\'s about maintaining code quality, team velocity, and user experience as your application grows...',
    contentHTML: `
      <p>Scalability is about more than just handling lots of users. It's about maintaining code quality, team velocity, and user experience as your application grows.</p>
      
      <h2>Component Architecture</h2>
      <p>A well-thought-out component architecture is the foundation of a scalable React application. Think in terms of composition, reusability, and clear boundaries.</p>
      
      <h2>State Management Strategies</h2>
      <p>As your app grows, state management becomes critical. Whether you choose Context, Redux, or Zustand, consistency is key.</p>
      
      <h2>Performance Optimization</h2>
      <p>Don't optimize prematurely, but do plan for scale. Code splitting, lazy loading, and memoization are your friends.</p>
    `,
    authorId: '3',
    author: mockUsers[2],
    datePublished: '2025-11-01',
    status: 'published',
    tags: ['React', 'JavaScript', 'Architecture'],
    readTime: 12,
    stats: { likes: 892, comments: 67, views: 4120 },
    thumbnail: 'https://images.unsplash.com/photo-1548123325-525b8e0cde7c?w=800&h=400&fit=crop',
  },
  {
    id: '4',
    title: 'The Art of Minimalist Design',
    excerpt: 'Less is more. This principle has guided design for decades, but what does it really mean in the context of modern digital products?',
    contentHTML: `
      <p>Less is more. This principle has guided design for decades, but what does it really mean in the context of modern digital products?</p>
      
      <h2>Clarity Over Complexity</h2>
      <p>Minimalism isn't about removing features—it's about removing distractions. Every element should serve a purpose.</p>
      
      <h2>Whitespace as a Design Element</h2>
      <p>Whitespace (or negative space) is not wasted space. It gives your content room to breathe and helps guide the user's attention.</p>
      
      <h2>Typography in Minimalist Design</h2>
      <p>When you strip away decorative elements, typography becomes even more important. Choose fonts that are both beautiful and functional.</p>
    `,
    authorId: '4',
    author: mockUsers[3],
    datePublished: '2025-10-28',
    status: 'published',
    tags: ['Design', 'Minimalism', 'UI'],
    readTime: 6,
    stats: { likes: 734, comments: 31, views: 3200 },
    thumbnail: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=800&h=400&fit=crop',
  },
  {
    id: '5',
    title: 'Understanding TypeScript Generics',
    excerpt: 'Generics are one of TypeScript\'s most powerful features, yet many developers find them confusing. Let\'s demystify them with practical examples...',
    contentHTML: `
      <p>Generics are one of TypeScript's most powerful features, yet many developers find them confusing. Let's demystify them with practical examples.</p>
      
      <h2>What Are Generics?</h2>
      <p>Generics allow you to write reusable, type-safe code that works with multiple types while maintaining type information.</p>
      
      <h2>Common Use Cases</h2>
      <p>From array operations to API wrappers, generics help you write more flexible and maintainable code.</p>
    `,
    authorId: '1',
    author: mockUsers[0],
    datePublished: '2025-10-25',
    status: 'published',
    tags: ['TypeScript', 'Programming', 'Tutorial'],
    readTime: 10,
    stats: { likes: 445, comments: 19, views: 1890 },
    thumbnail: 'https://images.unsplash.com/photo-1576936422505-18d321d54d40?w=800&h=400&fit=crop',
  },
];

export const mockComments: Comment[] = [
  {
    id: 'c1',
    postId: '1',
    authorId: '2',
    author: mockUsers[1],
    parentId: null,
    content: 'Great insights! I especially appreciate your take on AI-assisted development. It\'s definitely changing how we work.',
    date: '2025-11-06T10:30:00Z',
    likes: 12,
    isLiked: false,
    replies: [
      {
        id: 'c1-1',
        postId: '1',
        authorId: '1',
        author: mockUsers[0],
        parentId: 'c1',
        content: 'Thanks Alex! I think we\'re just scratching the surface of what\'s possible.',
        date: '2025-11-06T11:15:00Z',
        likes: 5,
        isLiked: false,
      },
    ],
  },
  {
    id: 'c2',
    postId: '1',
    authorId: '3',
    author: mockUsers[2],
    parentId: null,
    content: 'Edge computing is such a game changer. We\'ve been experimenting with it at work and the performance improvements are incredible.',
    date: '2025-11-06T14:20:00Z',
    likes: 8,
    isLiked: true,
    replies: [],
  },
  {
    id: 'c3',
    postId: '1',
    authorId: '4',
    author: mockUsers[3],
    parentId: null,
    content: 'Would love to see more concrete examples of edge computing use cases. Any plans for a follow-up article?',
    date: '2025-11-07T09:00:00Z',
    likes: 15,
    isLiked: false,
    replies: [],
  },
];

// export const mockNotifications: Notification[] = [
//   {
//     id: 'n1',
//     type: 'like',
//     message: 'Sarah Chen liked your post "Building Scalable React Applications"',
//     read: false,
//     date: '2025-11-08T08:30:00Z',
//     userId: '1',
//     postId: '3',
//   },
//   {
//     id: 'n2',
//     type: 'comment',
//     message: 'Alex Rivera commented on your post',
//     read: false,
//     date: '2025-11-08T07:15:00Z',
//     userId: '2',
//     postId: '1',
//   },
//   {
//     id: 'n3',
//     type: 'follow',
//     message: 'Emma Thompson started following you',
//     read: true,
//     date: '2025-11-07T18:45:00Z',
//     userId: '4',
//   },
// ];

// Helper functions
export function getPostById(id: string): Post | undefined {
  return mockPosts.find(post => post.id === id);
}

export function getCommentsByPostId(postId: string): Comment[] {
  return mockComments.filter(comment => comment.postId === postId && comment.parentId === null);
}

export function getUserById(id: string): User | undefined {
  return mockUsers.find(user => user.id === id);
}

export function getPostsByAuthor(authorId: string): Post[] {
  return mockPosts.filter(post => post.authorId === authorId);
}

// export function getUnreadNotificationsCount(): number {
//   return mockNotifications.filter(n => !n.read).length;
// }
