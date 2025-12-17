// src/features/post/components/Comment.tsx
import { useState } from 'react';
import { Heart, MessageCircle, MoreHorizontal, CornerDownRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../../../ui/avatar';
import { Button } from '../../../ui/button';
import { Textarea } from '../../../ui/textarea';

import { Comment as IComment } from '../types';

interface CommentProps {
  comment: IComment;
  depth?: number; // Độ sâu của comment (cấp 0 là cha, cấp 1 là con)
  onReply?: (commentId: string, content: string) => void;
  onLike?: (commentId: string) => void;
}

export function Comment({ comment, depth = 0, onReply, onLike }: CommentProps) {
  // State cho khung soạn thảo reply
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  
  // [MỚI] State để ẩn/hiện danh sách reply con (Mặc định ẩn)
  const [showNestedReplies, setShowNestedReplies] = useState(false);

  // Fake like logic (UI only)
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
      setIsReplying(false);
      // Khi reply xong thì tự động mở danh sách reply để thấy comment mới
      setShowNestedReplies(true);
    }
  };

  const formattedDate = new Date(comment.date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric'
  });

  const displayName = comment.author?.displayName || 'Unknown';
  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div className={`group animate-in fade-in duration-300 ${depth > 0 ? 'ml-0' : ''}`}>
      <div className="flex gap-3 py-3">
        {/* Avatar */}
        <Avatar className={`${depth > 0 ? 'h-7 w-7' : 'h-9 w-9'} flex-shrink-0 mt-1`}>
          <AvatarImage src={comment.author?.avatar} alt={displayName} />
          <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          {/* Bubble chứa nội dung */}
          <div className="bg-secondary/50 rounded-2xl px-4 py-2 inline-block max-w-full">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-sm font-semibold text-foreground">{displayName}</span>
            </div>
            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
              {comment.content}
            </p>
          </div>

          {/* Actions Bar (Like, Reply, Time) */}
          <div className="flex items-center gap-4 mt-1 ml-2 text-xs text-muted-foreground">
             <span>{formattedDate}</span>
             
             <button 
                onClick={handleLike} 
                className={`font-semibold hover:underline ${isLiked ? 'text-red-500' : ''}`}
             >
                {isLiked ? 'Liked' : 'Like'} {likes > 0 && `(${likes})`}
             </button>

             <button 
                onClick={() => setIsReplying(!isReplying)} 
                className="font-semibold hover:underline"
             >
                Reply
             </button>
          </div>

          {/* Form soạn thảo Reply */}
          {isReplying && (
            <div className="mt-3 flex gap-2 animate-in slide-in-from-top-2 duration-200">
               <Textarea
                placeholder={`Reply to ${displayName}...`}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[40px] text-sm resize-none bg-background"
                autoFocus
              />
              <Button size="sm" onClick={handleSubmitReply}>Send</Button>
            </div>
          )}

          {/* --- PHẦN XỬ LÝ REPLY LOGIC (FACEBOOK STYLE) --- */}
          {hasReplies && (
            <div className="mt-2">
              {/* Nút Xem Reply (Chỉ hiện khi đang đóng) */}
              {!showNestedReplies ? (
                <button 
                   onClick={() => setShowNestedReplies(true)}
                   className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors ml-1"
                >
                   <CornerDownRight className="h-3 w-3" />
                   View {comment.replies!.length} replies
                </button>
              ) : (
                // Danh sách Reply (Đệ quy)
                <div className="pl-0 space-y-0">
                   {comment.replies!.map((reply) => (
                      <Comment
                        key={reply.id}
                        comment={reply}
                        depth={depth + 1} // Tăng độ sâu
                        onReply={onReply}
                        onLike={onLike}
                      />
                   ))}
                   
                   {/* Nút Ẩn Reply (Tùy chọn) */}
                   {/* <button 
                     onClick={() => setShowNestedReplies(false)}
                     className="text-xs text-muted-foreground hover:underline ml-2 mt-2"
                   >
                     Hide replies
                   </button> 
                   */}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}