import { useOutletContext, useNavigate } from 'react-router-dom';
import { PostCard } from '../features/feed/PostCard';
import { Skeleton } from '../ui/skeleton';
import { usePosts } from '@/features/post/api/get-posts';

interface HomeContext {
  searchQuery: string;
}

export function Home() {
  const navigate = useNavigate();
  const { searchQuery } = useOutletContext<HomeContext>();
  
  // [FIX] Thêm status: 'published' để Home chỉ hiện bài đã public
  const { data: posts, isLoading, error } = usePosts({ 
    q: searchQuery,
    status: 'published' 
  });

  if (isLoading) {
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

  if (error) {
    // return <div className="text-center py-20 text-red-500">Failed to load stories.</div>;
    return <div className="text-center py-20 text-red-500">Login to get posts</div>;
  }

  if (!posts || posts.length === 0) {
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
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onClick={() => navigate(`/post/${post.id}`)}
        />
      ))}
    </div>
  );
}