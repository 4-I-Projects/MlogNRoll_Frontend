import { FileText, Eye, Edit, Trash2, MoreVertical } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/ui/dropdown-menu';
import { Post } from '@/features/post/types';
import { User } from '@/features/auth/types';

// [MỚI] Hooks
import { usePosts } from '@/features/post/api/get-posts';

export function Stories() {
  const navigate = useNavigate();
  const { currentUser } = useOutletContext<{ currentUser: User }>();

  // 1. Fetch Published Stories
  const { data: publishedStories, isLoading: loadingPublished } = usePosts({ 
    authorId: currentUser.id, 
    status: 'published' 
  });

  // 2. Fetch Drafts
  const { data: draftStories, isLoading: loadingDrafts } = usePosts({ 
    authorId: currentUser.id, 
    status: 'draft' 
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="mb-2 text-2xl font-bold text-foreground">Your Stories</h1>
          {/* [SỬA] Đổi text-gray-600 -> text-muted-foreground */}
          <p className="text-muted-foreground">Manage your published stories and drafts</p>
        </div>
        <Button onClick={() => navigate('/editor')}>
          <FileText className="h-4 w-4 mr-2" />
          Write a story
        </Button>
      </div>

      <Tabs defaultValue="published" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="published">
            Published {publishedStories ? `(${publishedStories.length})` : ''}
          </TabsTrigger>
          <TabsTrigger value="drafts">
            Drafts {draftStories ? `(${draftStories.length})` : ''}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="published">
          {loadingPublished ? (
            <div className="py-10">Loading...</div>
          ) : publishedStories && publishedStories.length > 0 ? (
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
          {loadingDrafts ? (
             <div className="py-10">Loading...</div>
          ) : draftStories && draftStories.length > 0 ? (
            <div className="space-y-4">
              {draftStories.map((story) => (
                <StoryItem key={story.id} story={story} />
              ))}
            </div>
          ) : (
            <EmptyState title="No drafts" description="Your draft stories will appear here" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Component con
function StoryItem({ story }: { story: Post }) {
  const navigate = useNavigate();
  const formattedDate = new Date(story.datePublished || Date.now()).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <div 
      className="
        flex gap-4 p-4 
        rounded-lg border border-theme
        
        /* [SỬA QUAN TRỌNG] */
        /* 1. Thêm màu nền mặc định (biến đổi theo theme) */
        bg-[var(--story-item-bg)]
        
        /* 2. Màu nền khi hover (biến đổi theo theme) */
        hover:bg-[var(--hover-item-bg)]
        
        /* 3. Hiệu ứng mờ để chữ rõ hơn trên nền ảnh */
        backdrop-blur-sm
        
        transition-colors cursor-pointer
      "
      onClick={() => navigate(`/editor?id=${story.id}`)}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="font-semibold line-clamp-2 cursor-pointer hover:underline text-foreground">
            {story.title || "Untitled Draft"}
          </h3>
          {story.status === 'draft' && <Badge variant="secondary">Draft</Badge>}
        </div>
        {/* [SỬA] Đổi text-gray-500 -> text-muted-foreground */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{formattedDate}</span>
          {story.status === 'published' && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {story.stats?.views || 0} views</span>
            </>
          )}
        </div>
      </div>
      <div className="flex items-start gap-2">
        <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/editor?id=${story.id}`) }}>
          <Edit className="h-4 w-4 mr-2" /> Edit
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" onClick={(e) => e.stopPropagation()}><MoreVertical className="h-4 w-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="text-red-600"><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function EmptyState({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {/* Cũng đổi màu icon placeholder */}
      <FileText className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
      <h3 className="mb-2 font-medium text-foreground">{title}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>
      {action}
    </div>
  );
}