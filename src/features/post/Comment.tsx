import { useState } from 'react';
import { Heart, MessageCircle, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Comment as CommentType } from '../../lib/types';

interface CommentProps {
  comment: CommentType;
  depth?: number;
  onReply?: (commentId: string, content: string) => void;
  onLike?: (commentId: string) => void;
}

export function Comment({ comment, depth = 0, onReply, onLike }: CommentProps) {
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isLiked, setIsLiked] = useState(comment.isLiked || false);
  const [likes, setLikes] = useState(comment.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
    onLike?.(comment.id);
  };

  const handleSubmitReply = () => {
    if (replyContent.trim()) {
      onReply?.(comment.id, replyContent);
      setReplyContent('');
      setShowReply(false);
    }
  };

  const formattedDate = new Date(comment.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className={depth > 0 ? 'ml-12' : ''}>
      <div className="flex gap-3 py-4">
        <Avatar className="h-9 w-9 flex-shrink-0">
          <AvatarImage src={comment.author?.avatar} alt={comment.author?.name} />
          <AvatarFallback>{comment.author?.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm">{comment.author?.name}</span>
            <span className="text-xs text-gray-500">{formattedDate}</span>
          </div>

          <p className="text-sm text-gray-700 mb-2">{comment.content}</p>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 h-7 text-xs"
              onClick={handleLike}
            >
              <Heart className={`h-3 w-3 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              <span>{likes}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => setShowReply(!showReply)}
            >
              <MessageCircle className="h-3 w-3 mr-1" />
              Reply
            </Button>

            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>

          {showReply && (
            <div className="mt-3 space-y-2">
              <Textarea
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[80px] text-sm"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSubmitReply}>
                  Reply
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => {
                    setShowReply(false);
                    setReplyContent('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-0">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              onReply={onReply}
              onLike={onLike}
            />
          ))}
        </div>
      )}
    </div>
  );
}
