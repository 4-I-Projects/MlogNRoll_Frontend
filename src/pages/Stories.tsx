import { FileText, Eye, Edit, Trash2, MoreVertical } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/ui/dropdown-menu';
import { Post } from '@/features/post/types'; // [QUAN TRỌNG] Import type Post
import { User } from '@/features/auth/types';
import { usePosts } from '@/features/post/api/get-posts';
import { formatDate } from '@/utils/date';
import { POST_STATUS } from '@/config/constants';

export function Stories() {
  const navigate = useNavigate();
  const { currentUser } = useOutletContext<{ currentUser: User }>();

  // Fetch Published
  const { data: publishedStories, isLoading: loadingPublished } = usePosts({ 
    userId: currentUser.id, 
    status: POST_STATUS.PUBLISHED // Thay 'published'
  });

  // Fetch Drafts
  const { data: draftStories, isLoading: loadingDrafts } = usePosts({ 
    userId: currentUser.id, 
    status: POST_STATUS.DRAFT // Thay 'draft'
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="mb-2 text-2xl font-bold text-foreground">Your Stories</h1>
          <p className="text-muted-foreground">Manage your published stories and drafts</p>
        </div>
        <Button onClick={() => navigate('/editor')}>
          <FileText className="h-4 w-4 mr-2" />
          Write a story
        </Button>
      </div>

      <Tabs defaultValue={POST_STATUS.PUBLISHED} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value={POST_STATUS.PUBLISHED}>
            Published {publishedStories ? `(${publishedStories.length})` : ''}
          </TabsTrigger>
          <TabsTrigger value={POST_STATUS.DRAFT}>
            Drafts {draftStories ? `(${draftStories.length})` : ''}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={POST_STATUS.PUBLISHED}>
          {loadingPublished ? (
            <div className="py-10">Loading...</div>
          ) : publishedStories && publishedStories.length > 0 ? (
            <div className="space-y-4">
              {/* [FIX] Thêm kiểu (story: Post) để hết lỗi implicit any */}
              {publishedStories.map((story: Post) => (
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

        <TabsContent value={POST_STATUS.DRAFT}>
          {loadingDrafts ? (
             <div className="py-10">Loading...</div>
          ) : draftStories && draftStories.length > 0 ? (
            <div className="space-y-4">
              {/* [FIX] Thêm kiểu (story: Post) */}
              {draftStories.map((story: Post) => (
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

function StoryItem({ story }: { story: Post }) {
  const navigate = useNavigate();
  // ... (Code StoryItem giữ nguyên như trước)
  const formattedDate = formatDate(story.datePublished || new Date().toISOString());

  return (
    <div 
      className="flex gap-4 p-4 rounded-lg border border-theme bg-[var(--story-item-bg)] hover:bg-[var(--hover-item-bg)] backdrop-blur-sm transition-colors cursor-pointer"
      onClick={() => navigate(`/editor?id=${story.id}`)}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="font-semibold line-clamp-2 cursor-pointer hover:underline text-foreground">
            {story.title || "Untitled Draft"}
          </h3>
          {story.status === 'draft' && <Badge variant="secondary">Draft</Badge>}
        </div>
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
      <FileText className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
      <h3 className="mb-2 font-medium text-foreground">{title}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>
      {action}
    </div>
  );
}