// src/features/post/components/CommentsPanel.tsx
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../../ui/avatar';
import { Button } from '../../../ui/button';
import { Textarea } from '../../../ui/textarea';
import { Comment } from './Comment';
import { Comment as IComment } from '../types';
import { User } from '@/features/auth/types';

interface CommentsPanelProps {
  comments: IComment[];
  currentUser: User;
  onAddComment: (content: string) => void;
  onReply: (commentId: string, content: string) => void;
  onLike: (commentId: string) => void;
}

export function CommentsPanel({ 
  comments, 
  currentUser, 
  onAddComment, 
  onReply, 
  onLike 
}: CommentsPanelProps) {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = () => {
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
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
          <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-3">
          <Textarea
            placeholder="What are your thoughts?"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <div className="flex justify-end gap-2">
            {newComment && (
              <Button 
                variant="ghost" 
                onClick={() => setNewComment('')}
              >
                Cancel
              </Button>
            )}
            <Button onClick={handleSubmit} disabled={!newComment.trim()}>
              Post Comment
            </Button>
          </div>
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-2">
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            onReply={onReply}
            onLike={onLike}
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