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

// [MỚI] Import hook API
import { usePost } from '@/features/post/api/get-post';

interface PostDetailPageProps {
  currentUser: User;
}

export function PostDetailPage({ currentUser }: PostDetailPageProps) {
  const navigate = useNavigate();
  const { postId } = useParams(); 
  
  const safePostId = postId || '';

  // [MỚI] Gọi API Hook
  const { data: post, isLoading, error } = usePost(safePostId);

  // State cho các tương tác (Like, Comment)
  // Khởi tạo giá trị mặc định, sẽ được cập nhật khi API trả về data
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likes, setLikes] = useState(0);

  // [MỚI] Đồng bộ dữ liệu từ API vào Local State khi load xong
  useEffect(() => {
    if (post) {
      setLikes(post.stats?.likes || 0);
      setIsLiked(post.isLiked || false);
      
      // Tạm thời vẫn dùng Mock Data cho comment vì chưa có API Comment
      setComments(getCommentsByPostId(safePostId)); 
    }
  }, [post, safePostId]);

  // [MỚI] Loading State
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

  // [MỚI] Error State
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
    // TODO: Gọi API like/unlike ở đây
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
    // TODO: Gọi API create comment ở đây
  };

  const handleReply = (commentId: string, content: string) => {
    console.log('Reply to', commentId, content);
  };

  const handleLikeComment = (commentId: string) => {
    console.log('Like comment', commentId);
  };

  // Logic related posts vẫn dùng mock data tạm thời
  const relatedPosts = mockPosts
    .filter((p) => p.authorId === post.author?.id && p.id !== post.id)
    .slice(0, 4);

  return (
    <div className="pb-20">
      <article className="max-w-3xl mx-auto">
        <h1 className="mb-4 text-3xl font-bold">{post.title}</h1>
        
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
          dangerouslySetInnerHTML={{ __html: post.contentHTML }} 
        />

        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
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
          <h2 className="mb-6 font-semibold text-xl">More from {post.author?.name}</h2>
          <div className="space-y-0">
            {relatedPosts.map((relatedPost) => (
              <PostCard
                key={relatedPost.id}
                post={relatedPost}
                onClick={() => navigate(`/post/${relatedPost.id}`)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}