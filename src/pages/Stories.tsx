import { FileText, Eye, Edit, Trash2, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // [MỚI]
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
import { mockPosts } from '@/lib/mockData';
import { Post } from '@/features/post/types';

// [XÓA] interface StoriesProps

export function Stories() {
  const navigate = useNavigate(); // [MỚI]

  const publishedStories = mockPosts.slice(0, 2);
  const draftStories: Post[] = [
    {
      ...mockPosts[0],
      id: 'draft-1',
      title: 'Understanding React Server Components',
      status: 'draft',
      datePublished: '2025-11-08',
      stats: { likes: 0, comments: 0, views: 0 },
    },
  ];
  const unlistedStories: Post[] = [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="mb-2">Your Stories</h1>
          <p className="text-gray-600">
            Manage your published stories and drafts
          </p>
        </div>
        <Button onClick={() => navigate('/editor')}>
          <FileText className="h-4 w-4 mr-2" />
          Write a story
        </Button>
      </div>

      <Tabs defaultValue="published" className="w-full">
        {/* ... TabsList giữ nguyên ... */}
        <TabsList className="mb-6">
          <TabsTrigger value="published">Published ({publishedStories.length})</TabsTrigger>
          <TabsTrigger value="drafts">Drafts ({draftStories.length})</TabsTrigger>
          <TabsTrigger value="unlisted">Unlisted ({unlistedStories.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="published">
          {publishedStories.length > 0 ? (
            <div className="space-y-4">
              {publishedStories.map((story) => (
                <StoryItem key={story.id} story={story} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No published stories"
              description="Start writing and publish your first story"
              action={<Button onClick={() => navigate('/editor')}>Write a story</Button>}
            />
          )}
        </TabsContent>

        <TabsContent value="drafts">
          {draftStories.length > 0 ? (
            <div className="space-y-4">
              {draftStories.map((story) => (
                <StoryItem key={story.id} story={story} />
              ))}
            </div>
          ) : (
            <EmptyState title="No drafts" description="Your draft stories will appear here" />
          )}
        </TabsContent>

        <TabsContent value="unlisted">
          {unlistedStories.length > 0 ? (
            <div className="space-y-4">
              {unlistedStories.map((story) => (
                <StoryItem key={story.id} story={story} />
              ))}
            </div>
          ) : (
            <EmptyState title="No unlisted stories" description="Stories set to unlisted will appear here" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// [SỬA] Component StoryItem tự dùng hook
function StoryItem({ story }: { story: Post }) {
  const navigate = useNavigate(); // [MỚI]
  
  const formattedDate = new Date(story.datePublished).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="flex gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="line-clamp-2 cursor-pointer hover:underline" onClick={() => navigate(`/post/${story.id}`)}>
            {story.title}
          </h3>
          {story.status === 'draft' && (
            <Badge variant="secondary">Draft</Badge>
          )}
        </div>
        {/* ... Giữ nguyên phần hiển thị nội dung ... */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {story.excerpt}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>{formattedDate}</span>
          {story.status === 'published' && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {story.stats.views} views
              </span>
              <span>·</span>
              <span>{story.stats.likes} likes</span>
              <span>·</span>
              <span>{story.stats.comments} comments</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-start gap-2">
        <Button variant="outline" size="sm" onClick={() => navigate('/editor')}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/post/${story.id}`)}>
              <Eye className="h-4 w-4 mr-2" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuItem>Change visibility</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function EmptyState({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <FileText className="h-12 w-12 text-gray-300 mb-4" />
      <h3 className="mb-2">{title}</h3>
      <p className="text-gray-500 mb-6">{description}</p>
      {action}
    </div>
  );
}