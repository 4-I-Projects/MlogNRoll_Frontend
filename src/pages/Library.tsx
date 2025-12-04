import { Bookmark, Star, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { PostCard } from '@/features/feed/PostCard';
import { usePosts } from '@/features/post/api/get-posts';
import { Post } from '@/features/post/types';


export function Library() {
  const navigate = useNavigate();
  
  const { data: savedPosts, isLoading: loadingSaved } = usePosts({ isSaved: true });

  const { data: favoritePosts, isLoading: loadingFavorites } = usePosts({ isLiked: true });

  const { data: readLaterPosts } = usePosts({ status: 'read_later' }); 

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold">Library</h1>
        <p className="text-gray-600">Your saved stories, favorites, and reading list</p>
      </div>

      <Tabs defaultValue="saved" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="saved" className="gap-2">
            <Bookmark className="h-4 w-4" /> Saved
          </TabsTrigger>
          <TabsTrigger value="favorites" className="gap-2">
            <Star className="h-4 w-4" /> Favorites
          </TabsTrigger>
          <TabsTrigger value="later" className="gap-2">
            <Clock className="h-4 w-4" /> Read Later
          </TabsTrigger>
        </TabsList>

        <TabsContent value="saved">
          <PostList 
            posts={savedPosts} 
            loading={loadingSaved} 
            emptyIcon={<Bookmark className="h-12 w-12 text-gray-300" />}
            emptyTitle="No saved stories yet"
            emptyDesc="Save stories to read later by clicking the bookmark icon"
            onPostClick={(id) => navigate(`/post/${id}`)}
          />
        </TabsContent>

        <TabsContent value="favorites">
          <PostList 
            posts={favoritePosts} 
            loading={loadingFavorites}
            emptyIcon={<Star className="h-12 w-12 text-gray-300" />}
            emptyTitle="No favorites yet"
            emptyDesc="Mark your favorite stories by clicking the star icon"
            onPostClick={(id) => navigate(`/post/${id}`)}
          />
        </TabsContent>

        <TabsContent value="later">
           <PostList 
            posts={readLaterPosts} 
            loading={false}
            emptyIcon={<Clock className="h-12 w-12 text-gray-300" />}
            emptyTitle="Reading list is empty"
            emptyDesc="Add stories to read later"
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
  if (loading) return <div className="py-10 text-center">Loading...</div>;
  
  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        {emptyIcon}
        <h3 className="mt-4 mb-2 font-medium">{emptyTitle}</h3>
        <p className="text-gray-500">{emptyDesc}</p>
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onClick={() => onPostClick(post.id)} />
      ))}
    </div>
  );
}