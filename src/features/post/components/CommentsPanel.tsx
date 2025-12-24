// src/features/post/components/CommentsPanel.tsx
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { Button } from '@/ui/button';
import { Textarea } from '@/ui/textarea';
import { Comment as CommentComponent } from './Comment';
import { Comment } from '@/features/post/api/comment-api'; // [MỚI] Import Type từ API
import { User } from '@/features/auth/types';

interface CommentsPanelProps {
  comments: Comment[];
  currentUser: User;
  onAddComment: (content: string) => void; 
  // onReply cần nhận parentId để biết reply cho ai
  onReply: (parentId: string, content: string) => void; 
  onLike: (commentId: string) => void;
  // [MỚI] Thêm hàm load reply
  onLoadReplies?: (commentId: string) => void; 
}

export function CommentsPanel({ 
  comments, 
  currentUser, 
  onAddComment, 
  onReply, 
  onLike,
  onLoadReplies
}: CommentsPanelProps) {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // UI state

  const handleSubmit = async () => {
    if (newComment.trim()) {
      setIsSubmitting(true);
      try {
        await onAddComment(newComment); // Chờ API
        setNewComment('');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const userName = currentUser.displayName || currentUser.username;

  return (
    <div className="mt-12 border-t pt-8">
      <h2 className="mb-6 font-bold text-xl">Comments ({comments.length})</h2>

      {/* Add new comment */}
      <div className="mb-8 flex gap-4">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={currentUser.avatar} alt={userName} />
          <AvatarFallback>{userName?.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-3">
          <Textarea
            placeholder="What are your thoughts?"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px] resize-none"
            disabled={isSubmitting}
          />
          <div className="flex justify-end gap-2">
            {newComment && (
              <Button 
                variant="ghost" 
                onClick={() => setNewComment('')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            <Button onClick={handleSubmit} disabled={!newComment.trim() || isSubmitting}>
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-6"> {/* Tăng khoảng cách */}
        {comments.map((comment) => (
          <CommentComponent
            key={comment.id}
            comment={comment}
            onReply={onReply}
            onLike={onLike}
            onLoadReplies={onLoadReplies}
          />
        ))}
      </div>

      {comments.length === 0 && (
        <div className="text-center py-12 text-muted-foreground bg-secondary/20 rounded-lg">
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  );
}