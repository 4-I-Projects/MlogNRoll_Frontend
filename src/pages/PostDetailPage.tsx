import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { AuthorRow } from '../features/post/components/AuthorRow';
import { CommentsPanel } from '../features/post/components/CommentsPanel';
import { Comment } from '../features/post/types';
import { User } from '../features/auth/types';
import { getCommentsByPostId, mockPosts } from '../lib/mockData'; // Bỏ getPostById
import { PostCard } from '../features/feed/PostCard';
import { useNavigate, useParams } from 'react-router-dom';

import { usePost } from '@/features/post/api/get-post';
import { themes } from '../themes';

interface PostDetailPageProps {
  currentUser: User;
}

export function PostDetailPage({ currentUser }: PostDetailPageProps) {
  const navigate = useNavigate();
  const { postId } = useParams();

  const safePostId = postId || '';

  const { data: post, isLoading, error } = usePost(safePostId);

  const [comments, setComments] = useState<Comment[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    if (post) {
      setLikes(post.stats?.likes || 0);
      setIsLiked(post.isLiked || false);

      setComments(getCommentsByPostId(safePostId));
    }
  }, [post, safePostId]);

  const currentThemeId = post ? (post as any).themeId : 'happy';
  const theme = themes[currentThemeId as keyof typeof themes] || themes.happy;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-40">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-4 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="h-3 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <h2 className="mb-2">Post not found</h2>
          <p className="text-gray-500 mb-4">The post you're looking for doesn't exist or an error occurred.</p>
          <Button onClick={() => navigate('/')}>Go to Home</Button>
        </div>
      </div>
    );
  }

  const handleFollowToggle = () => {
    if (post.author) {
      console.log('Toggle follow author:', post.author.id);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const handleAddComment = (content: string) => {
    const newComment: Comment = {
      id: `c${Date.now()}`,
      postId: post.id,
      authorId: currentUser.id,
      author: currentUser,
      parentId: null,
      content,
      date: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      replies: [],
    };
    setComments([...comments, newComment]);
  };

  const handleReply = (commentId: string, content: string) => {
    console.log('Reply to', commentId, content);
  };

  const handleLikeComment = (commentId: string) => {
    console.log('Like comment', commentId);
  };

  const relatedPosts = mockPosts
    .filter((p) => p.userId === post.author?.id && p.id !== post.id)
    .slice(0, 4);

  return (
    <div
      className="pb-20 min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: theme.background,
        color: theme.text
      }}
    >
      <article className="max-w-3xl mx-auto pt-10 px-6">
        <h1
          className="mb-4 text-3xl font-bold"
          style={{ color: theme.accent }}
        >
          {post.title}
        </h1>

        {post.author && (
          <AuthorRow
            author={post.author}
            datePublished={post.datePublished}
            readTime={post.readTime}
            onFollowToggle={handleFollowToggle}
          />
        )}

        <div className="flex items-center justify-between mb-8 py-4 border-y">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-2" onClick={handleLike}>
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              <span>{likes}</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <MessageCircle className="h-5 w-5" />
              <span>{comments.length}</span>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsSaved(!isSaved)}>
              <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon"><Share2 className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon"><MoreHorizontal className="h-5 w-5" /></Button>
          </div>
        </div>

        {/* Nội dung bài viết */}
        <div
          className="prose prose-lg max-w-none mb-8"
          style={{ '--tw-prose-body': theme.text, '--tw-prose-headings': theme.text } as any}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="flex flex-wrap gap-2 mb-8">
          {/* [SỬA 2] Render tag.name và dùng tag.id làm key */}
          {post.tags.map((tag) => (
            <Badge key={tag.id} variant="secondary">
              {tag.name}
            </Badge>
          ))}
        </div>

        <Separator className="my-8" />

        <CommentsPanel
          comments={comments}
          currentUser={currentUser}
          onAddComment={handleAddComment}
          onReply={handleReply}
          onLike={handleLikeComment}
        />
      </article>

      {relatedPosts.length > 0 && (
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="mb-6 font-semibold text-xl">
            More from {post.author?.displayName || 'Author'}
          </h2>
          <div className="space-y-0">
            {relatedPosts.map((relatedPost) => (
              <PostCard
                key={relatedPost.id}
                post={relatedPost}
                onClick={() => navigate(`/post/${relatedPost.id}`)} // Lưu ý đường dẫn route
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}