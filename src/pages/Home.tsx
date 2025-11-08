import { useState } from 'react';
import { PostCard } from '../components/feed/PostCard';
import { Skeleton } from '../components/ui/skeleton';
import { Post } from '../lib/types';
import { mockPosts } from '../lib/mockData';

interface HomeProps {
  onNavigate: (page: string, postId?: string) => void;
  searchQuery: string;
}

export function Home({ onNavigate, searchQuery }: HomeProps) {
  const [posts] = useState<Post[]>(mockPosts);
  const [loading] = useState(false);

  // Filter posts based on search query
  const filteredPosts = searchQuery
    ? posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : posts;

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border-b pb-6">
            <div className="flex gap-4">
              <div className="flex-1 space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Skeleton className="h-28 w-28 flex-shrink-0" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h3 className="mb-2">No posts found</h3>
        <p className="text-gray-500 mb-6">
          {searchQuery
            ? `No posts match "${searchQuery}"`
            : "There are no posts to display"}
        </p>
      </div>
    );
  }

  return (
    <div>
      {filteredPosts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onClick={() => onNavigate('post-detail', post.id)}
        />
      ))}
    </div>
  );
}
