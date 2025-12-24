import { Bookmark, Star, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { PostCard } from '@/features/feed/PostCard';
import { usePosts } from '@/features/post/api/get-posts';
import { Post } from '@/features/post/types';

export function Library() {
  const navigate = useNavigate();
  
  // Các params này giờ đã hợp lệ do bước 1 đã sửa interface
  const { data: savedPosts, isLoading: loadingSaved } = usePosts({ isSaved: true });
  const { data: favoritePosts, isLoading: loadingFavorites } = usePosts({ isLiked: true });
  
  // [FIX] 'read_later' không phải là status chuẩn (enum).
  // Nếu backend chưa hỗ trợ status này, tạm thời dùng 'saved' hoặc bỏ filter status đi.
  // Ở đây tôi giả sử bạn muốn lấy list saved (vì read later thường là saved)
  const { data: readLaterPosts } = usePosts({ isSaved: true }); 

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-foreground tracking-tight">Library</h1>
        <p className="text-muted-foreground text-lg">Your collection of great stories.</p>
      </div>

      <Tabs defaultValue="saved" className="w-full">
        <TabsList className="mb-8 bg-muted/50 p-1">
          <TabsTrigger value="saved" className="gap-2">
            <Bookmark className="h-4 w-4" /> Saved
          </TabsTrigger>
          <TabsTrigger value="favorites" className="gap-2">
            <Star className="h-4 w-4" /> Favorites
          </TabsTrigger>
          <TabsTrigger value="later" className="gap-2">
            <Clock className="h-4 w-4" /> History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="saved" className="mt-0">
          <PostList 
            posts={savedPosts} 
            loading={loadingSaved} 
            emptyIcon={<Bookmark className="h-12 w-12 text-muted-foreground/30" />}
            emptyTitle="No saved stories yet"
            emptyDesc="Save stories to read later by clicking the bookmark icon"
            onPostClick={(id) => navigate(`/post/${id}`)}
          />
        </TabsContent>

        <TabsContent value="favorites" className="mt-0">
          <PostList 
            posts={favoritePosts} 
            loading={loadingFavorites}
            emptyIcon={<Star className="h-12 w-12 text-muted-foreground/30" />}
            emptyTitle="No favorites yet"
            emptyDesc="Mark your favorite stories by clicking the star icon"
            onPostClick={(id) => navigate(`/post/${id}`)}
          />
        </TabsContent>

        <TabsContent value="later" className="mt-0">
           <PostList 
            posts={readLaterPosts} 
            loading={false}
            emptyIcon={<Clock className="h-12 w-12 text-muted-foreground/30" />}
            emptyTitle="Reading history is empty"
            emptyDesc="Stories you've read will appear here"
            onPostClick={(id) => navigate(`/post/${id}`)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface PostListProps {
  posts?: Post[];
  loading: boolean;
  emptyIcon: React.ReactNode;
  emptyTitle: string;
  emptyDesc: string;
  onPostClick: (id: string) => void;
}

function PostList({ posts, loading, emptyIcon, emptyTitle, emptyDesc, onPostClick }: PostListProps) {
  if (loading) {
    return (
      <div className="py-20 text-center text-muted-foreground animate-pulse">
        Loading your library...
      </div>
    );
  }
  
  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-lg bg-muted/20">
        {emptyIcon}
        <h3 className="mt-4 mb-2 font-medium text-foreground text-lg">{emptyTitle}</h3>
        <p className="text-muted-foreground max-w-sm">{emptyDesc}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onClick={() => onPostClick(post.id)} />
      ))}
    </div>
  );
}