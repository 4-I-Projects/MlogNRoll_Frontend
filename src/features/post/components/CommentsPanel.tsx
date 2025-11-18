import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../../ui/avatar';
import { Button } from '../../../ui/button';
import { Textarea } from '../../../ui/textarea';
import { Comment } from './Comment';
import { Comment as CommentType, User } from '../../../lib/types';

interface CommentsPanelProps {
  comments: CommentType[];
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

  return (
    <div className="mt-12 border-t pt-8">
      <h2 className="mb-6">Comments ({comments.length})</h2>

      {/* Add new comment */}
      <div className="mb-8">
        <div className="flex gap-3">
          <Avatar className="h-9 w-9 flex-shrink-0">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            <Textarea
              placeholder="What are your thoughts?"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-end gap-2">
              <Button 
                variant="ghost" 
                onClick={() => setNewComment('')}
                disabled={!newComment}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!newComment.trim()}>
                Publish
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-0 divide-y">
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
        <div className="text-center py-12 text-gray-500">
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  );
}
