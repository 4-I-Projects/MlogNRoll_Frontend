import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { AuthorRow } from '../features/post/components/AuthorRow';
import { CommentsPanel } from '../features/post/components/CommentsPanel';
import { Post, Comment } from '../features/post/types';
import { User } from '../features/auth/types';
import { getPostById, getCommentsByPostId, mockPosts } from '../lib/mockData';
import { PostCard } from '../features/feed/PostCard';

interface PostDetailPageProps {
  postId: string;
  currentUser: User;
  onNavigate: (page: string, postId?: string) => void;
}

export function PostDetailPage({ postId, currentUser, onNavigate }: PostDetailPageProps) {
  const [post, setPost] = useState<Post | undefined>(getPostById(postId));
  const [comments, setComments] = useState<Comment[]>(getCommentsByPostId(postId));
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likes, setLikes] = useState(post?.stats.likes || 0);

  useEffect(() => {
    const foundPost = getPostById(postId);
    setPost(foundPost);
    setComments(getCommentsByPostId(postId));
    setLikes(foundPost?.stats.likes || 0);
  }, [postId]);

  if (!post) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <h2 className="mb-2">Post not found</h2>
          <p className="text-gray-500 mb-4">The post you're looking for doesn't exist.</p>
          <Button onClick={() => onNavigate('home')}>Go to Home</Button>
        </div>
      </div>
    );
  }

  const handleFollowToggle = () => {
    if (post.author) {
      post.author.isFollowing = !post.author.isFollowing;
      setPost({ ...post });
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

  // Get related posts from same author
  const relatedPosts = mockPosts
    .filter((p) => p.authorId === post.authorId && p.id !== post.id)
    .slice(0, 4);

  return (
    <div className="pb-20">
      {/* Article Header */}
      <article className="max-w-3xl mx-auto">
        <h1 className="mb-4">{post.title}</h1>
        
        <AuthorRow
          author={post.author!}
          datePublished={post.datePublished}
          readTime={post.readTime}
          onFollowToggle={handleFollowToggle}
        />

        {/* Action buttons */}
        <div className="flex items-center justify-between mb-8 py-4 border-y">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={handleLike}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              <span>{likes}</span>
            </Button>

            <Button variant="ghost" size="sm" className="gap-2">
              <MessageCircle className="h-5 w-5" />
              <span>{comments.length}</span>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSaved(!isSaved)}
            >
              <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
            </Button>

            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Article Content */}
        <div
          className="prose prose-lg max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: post.contentHTML }}
        />

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        {post.series && (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Part of series:</p>
            <p>{post.series}</p>
          </div>
        )}

        <Separator className="my-8" />

        {/* Comments */}
        <CommentsPanel
          comments={comments}
          currentUser={currentUser}
          onAddComment={handleAddComment}
          onReply={handleReply}
          onLike={handleLikeComment}
        />
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="mb-6">More from {post.author?.name}</h2>
          <div className="space-y-0">
            {relatedPosts.map((relatedPost) => (
              <PostCard
                key={relatedPost.id}
                post={relatedPost}
                onClick={() => onNavigate('post-detail', relatedPost.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
