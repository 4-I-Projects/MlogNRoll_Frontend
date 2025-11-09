import { useState } from 'react';
import { Bookmark, Star, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { PostCard } from '../components/feed/PostCard';
import { mockPosts } from '../lib/mockData';

interface LibraryProps {
  onNavigate: (page: string, postId?: string) => void;
}

export function Library({ onNavigate }: LibraryProps) {
  // Mock saved posts (first 2 posts)
  const savedPosts = mockPosts.slice(0, 2);
  const favoritePosts = mockPosts.slice(1, 3);
  const readLaterPosts = mockPosts.slice(2, 4);

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2">Library</h1>
        <p className="text-gray-600">
          Your saved stories, favorites, and reading list
        </p>
      </div>

      <Tabs defaultValue="saved" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="saved" className="gap-2">
            <Bookmark className="h-4 w-4" />
            Saved
          </TabsTrigger>
          <TabsTrigger value="favorites" className="gap-2">
            <Star className="h-4 w-4" />
            Favorites
          </TabsTrigger>
          <TabsTrigger value="later" className="gap-2">
            <Clock className="h-4 w-4" />
            Read Later
          </TabsTrigger>
        </TabsList>

        <TabsContent value="saved">
          {savedPosts.length > 0 ? (
            <div>
              {savedPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onClick={() => onNavigate('post-detail', post.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Bookmark className="h-12 w-12 text-gray-300" />}
              title="No saved stories yet"
              description="Save stories to read later by clicking the bookmark icon"
            />
          )}
        </TabsContent>

        <TabsContent value="favorites">
          {favoritePosts.length > 0 ? (
            <div>
              {favoritePosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onClick={() => onNavigate('post-detail', post.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Star className="h-12 w-12 text-gray-300" />}
              title="No favorites yet"
              description="Mark your favorite stories by clicking the star icon"
            />
          )}
        </TabsContent>

        <TabsContent value="later">
          {readLaterPosts.length > 0 ? (
            <div>
              {readLaterPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onClick={() => onNavigate('post-detail', post.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Clock className="h-12 w-12 text-gray-300" />}
              title="Reading list is empty"
              description="Add stories to read later"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyState({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {icon}
      <h3 className="mt-4 mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );
}
