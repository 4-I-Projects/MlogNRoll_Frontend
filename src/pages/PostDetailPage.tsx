import { useState, useEffect, useMemo } from 'react';
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal, ArrowLeft, Eye } from 'lucide-react';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { Separator } from '@/ui/separator';
import { AuthorRow } from '@/features/post/components/AuthorRow';
import { CommentsPanel } from '@/features/post/components/CommentsPanel';
import { User } from '@/features/auth/types';
import { mockPosts } from '@/lib/mockData';
import { PostCard } from '@/features/feed/PostCard';
import { useNavigate, useParams } from 'react-router-dom';
import { usePost } from '@/features/post/api/get-post';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { cn } from '@/ui/utils';
import { toast } from 'sonner';
// [MỚI] Import theme context
import { useTheme } from '@/context/ThemeContext';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getComments, createComment, Comment as IComment } from '@/features/post/api/comment-api';

interface PostDetailPageProps {
  currentUser: User;
}

export function PostDetailPage({ currentUser }: PostDetailPageProps) {
  const navigate = useNavigate();
  const { postId } = useParams();
  const safePostId = postId || '';
  const queryClient = useQueryClient();
  // [MỚI] Lấy hàm setThemeId
  const { setThemeId } = useTheme();

  // 1. Fetch data
  const { data: post, isLoading, error } = usePost(safePostId);

  const { data: commentsData } = useQuery({
    queryKey: ['comments', safePostId],
    queryFn: () => getComments(safePostId),
    enabled: !!safePostId,
  });

  // [MỚI] Effect tự động đổi theme theo mood của bài viết
  useEffect(() => {
    if (post) {
      // Nếu post có mood thì set, nếu không (null/undefined) thì về 'happy'
      setThemeId(post.mood || 'happy');
    }
    // Optional: Bạn có thể thêm cleanup function để reset theme khi rời trang nếu muốn
    // return () => setThemeId('happy');
  }, [post, setThemeId]);

  // Build Tree Comments
  const comments = useMemo(() => {
    const flatComments = commentsData?.data || [];
    const commentMap: Record<string, IComment> = {};
    const roots: IComment[] = [];

    flatComments.forEach((c) => {
      commentMap[c.id] = { ...c, replies: [] }; 
    });

    flatComments.forEach((c) => {
      if (c.parentId) {
        const parent = commentMap[c.parentId];
        if (parent) {
          parent.replies?.push(commentMap[c.id]);
          parent.replyCount = (parent.replies?.length || 0);
        }
      } else {
        roots.push(commentMap[c.id]);
      }
    });

    return roots.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [commentsData]);


  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    if (post) {
      setLikes(post.stats?.likes || 0);
      setIsLiked(post.isLiked || false);
    }
  }, [post]);

  // 2. Mutations
  const createCommentMutation = useMutation({
    mutationFn: createComment,
    onSuccess: (newComment) => {
      toast.success('Đã gửi bình luận!');
      queryClient.invalidateQueries({ queryKey: ['comments', safePostId] });
    },
    onError: () => {
      toast.error('Gửi bình luận thất bại. Vui lòng thử lại.');
    }
  });

  const handleAddComment = (content: string) => {
    if (!safePostId) return;
    createCommentMutation.mutate({
      postId: Number(safePostId),
      content: content,
      parentId: undefined
    });
  };

  const handleReply = (parentId: string, content: string) => {
    if (!safePostId) return;
    createCommentMutation.mutate({
      postId: Number(safePostId),
      content: content,
      parentId: parentId
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-4 w-48 bg-muted rounded"></div>
          <div className="h-3 w-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Post not found</h2>
          <Button onClick={() => navigate('/')}>Go to Home</Button>
        </div>
      </div>
    );
  }

  const proseStyle = {
    '--tw-prose-body': 'var(--foreground)',
    '--tw-prose-headings': 'var(--foreground)',
    '--tw-prose-lead': 'var(--muted-foreground)',
    '--tw-prose-links': 'hsl(var(--primary))',
    '--tw-prose-bold': 'var(--foreground)',
    '--tw-prose-counters': 'var(--muted-foreground)',
    '--tw-prose-bullets': 'var(--muted-foreground)',
    '--tw-prose-hr': 'var(--border)',
    '--tw-prose-quotes': 'var(--foreground)',
    '--tw-prose-quote-borders': 'hsl(var(--primary))',
    '--tw-prose-captions': 'var(--muted-foreground)',
    '--tw-prose-code': 'var(--foreground)',
    '--tw-prose-pre-code': 'var(--foreground)',
    '--tw-prose-pre-bg': 'var(--muted)', 
  } as React.CSSProperties;

  const relatedPosts = mockPosts
    .filter((p) => p.userId === post.author?.id && p.id !== post.id)
    .slice(0, 3);

  const postContent = (post as any).body || post.content || ''; 

  return (
    <div className="animate-in fade-in duration-500 pb-20 pt-2"> 
      
      <div className="w-full mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="gap-2 text-muted-foreground hover:text-foreground pl-0 hover:bg-transparent"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 w-full">
        
        <main className="min-w-0">
          <article 
            className={cn(
              "rounded-lg border border-theme", 
              "bg-[var(--story-item-bg)]", 
              "backdrop-blur-sm", 
              "overflow-hidden",
              "text-card-foreground shadow-sm"
            )}
          >
            {post.thumbnail && (
              <div className="w-full aspect-[21/9] relative overflow-hidden border-b border-theme">
                <ImageWithFallback
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-8 md:p-12">
              <header className="mb-10">
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map((tag: any) => (
                      <Badge 
                        key={tag.id || tag} 
                        variant="secondary" 
                        className="bg-muted/50 text-foreground hover:bg-muted font-normal px-3 py-1"
                      >
                        #{tag.name || tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-foreground mb-8">
                  {post.title}
                </h1>

                <div className="flex items-center justify-between pt-4 border-t border-theme">
                  {post.author ? (
                      <AuthorRow
                        author={post.author}
                        datePublished={post.datePublished}
                        readTime={post.readTime}
                        onFollowToggle={() => {}}
                      />
                  ) : (
                      <div className="text-sm text-muted-foreground">Unknown Author</div>
                  )}
                  
                  <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-3 py-1 rounded-full">
                    <Eye className="h-4 w-4" />
                    <span>{post.stats?.views || 0} views</span>
                  </div>
                </div>
              </header>

              <Separator className="my-10 bg-border" />

              <div 
                className="prose prose-lg md:prose-xl dark:prose-invert max-w-none leading-relaxed break-words"
                style={proseStyle}
                dangerouslySetInnerHTML={{ __html: postContent }} 
              />

              <Separator className="my-10 bg-border" />

              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="lg" 
                    className={cn(
                      "gap-3 h-12 px-6 rounded-full hover:bg-muted transition-all text-base",
                      isLiked && "text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/50"
                    )}
                    onClick={handleLike}
                  >
                    <Heart className={cn("h-6 w-6", isLiked && "fill-current")} />
                    <span className="font-semibold">{likes}</span>
                  </Button>

                  <Button 
                    variant="ghost" 
                    size="lg" 
                    className="gap-3 h-12 px-6 rounded-full hover:bg-muted transition-all text-base"
                  >
                    <MessageCircle className="h-6 w-6" />
                    <span className="font-semibold">{comments.length}</span>
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-muted" onClick={() => setIsSaved(!isSaved)}>
                    <Bookmark className={cn("h-5 w-5", isSaved && "fill-foreground")} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-muted">
                    <Share2 className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-muted">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="mt-12 bg-muted/40 rounded-2xl p-8 border border-theme">
                <CommentsPanel
                  comments={comments}
                  currentUser={currentUser}
                  onAddComment={handleAddComment}
                  onReply={handleReply}
                  onLike={(id) => { console.log('Like comment feature pending:', id) }}
                />
              </div>
            </div>
          </article>
        </main>

        <aside className="space-y-8 hidden lg:block">
          {relatedPosts.length > 0 && (
            <div className="sticky top-24 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-foreground">
                  More from Author
                </h3>
              </div>
              <div className="space-y-6">
                {relatedPosts.map((relatedPost) => (
                  <div key={relatedPost.id} className="group relative">
                    <PostCard
                      post={relatedPost}
                      onClick={() => {
                          window.scrollTo(0, 0); 
                          navigate(`/post/${relatedPost.id}`);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

      </div>
    </div>
  );
}