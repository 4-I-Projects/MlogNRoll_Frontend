// src/features/post/components/Comment.tsx
import { useState } from 'react';
import { CornerDownRight, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { Button } from '@/ui/button';
import { Textarea } from '@/ui/textarea';
import { formatDate } from '@/utils/date';
import { Comment as IComment } from '@/features/post/api/comment-api'; // Import Type mới
import { useQuery } from '@tanstack/react-query'; // Dùng React Query tại chỗ để fetch reply
import { getReplies } from '@/features/post/api/comment-api';

interface CommentProps {
  comment: IComment;
  depth?: number;
  onReply: (parentId: string, content: string) => void;
  onLike?: (commentId: string) => void;
  onLoadReplies?: (commentId: string) => void; 
}

export function Comment({ comment, depth = 0, onReply, onLike }: CommentProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  
  // State để quản lý việc hiển thị reply
  const [showNestedReplies, setShowNestedReplies] = useState(false);

  // Fake like logic (UI only for now)
  const [isLiked, setIsLiked] = useState(comment.isLiked || false);
  const [likes, setLikes] = useState(comment.likeCount); // Dùng likeCount từ API

  // --- LOGIC FETCH REPLIES ---
  // Chỉ fetch khi người dùng bấm mở và chưa có data
  const { 
    data: repliesData, 
    isLoading: isLoadingReplies, 
    refetch: fetchReplies 
  } = useQuery({
    queryKey: ['replies', comment.id],
    queryFn: () => getReplies(comment.id),
    enabled: false, // Không tự động fetch
  });

  // Merge replies từ API với replies có sẵn (ví dụ vừa tạo xong)
  // Backend có thể trả về replies rỗng ban đầu.
  const replies = repliesData?.data || comment.replies || [];
  const hasReplies = comment.replyCount > 0 || replies.length > 0;

  const handleToggleReplies = () => {
    if (!showNestedReplies && !repliesData && comment.replyCount > 0) {
       fetchReplies(); // Gọi API lần đầu mở
    }
    setShowNestedReplies(!showNestedReplies);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
    onLike?.(comment.id);
  };

  const handleSubmitReply = () => {
    if (replyContent.trim()) {
      onReply(comment.id, replyContent); // Gửi ID cha
      setReplyContent('');
      setIsReplying(false);
      
      // Mở danh sách reply và có thể cần refetch để thấy comment mới
      setShowNestedReplies(true);
      if (comment.replyCount > 0) fetchReplies();
    }
  };

  const formattedDate = formatDate(comment.createdAt); // Dùng createdAt từ API
  const displayName = comment.user?.username || 'Unknown'; // Dùng user.username từ API
  const avatarUrl = comment.user?.avatarUrl;

  return (
    <div className={`group animate-in fade-in duration-300 ${depth > 0 ? 'mt-3' : ''}`}>
      <div className="flex gap-3 py-1">
        {/* Avatar */}
        <Avatar className={`${depth > 0 ? 'h-7 w-7' : 'h-9 w-9'} flex-shrink-0 mt-1`}>
          <AvatarImage src={avatarUrl || undefined} alt={displayName} />
          <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
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

          {/* Actions Bar */}
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

          {/* --- PHẦN HIỂN THỊ REPLIES --- */}
          {hasReplies && (
            <div className="mt-2">
              {!showNestedReplies ? (
                <button 
                   onClick={handleToggleReplies}
                   className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors ml-1"
                >
                   <CornerDownRight className="h-3 w-3" />
                   View {comment.replyCount || replies.length} replies
                </button>
              ) : (
                <div className="pl-0 space-y-0">
                   {isLoadingReplies ? (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground ml-2 mt-2">
                        <Loader2 className="h-3 w-3 animate-spin" /> Loading replies...
                      </div>
                   ) : (
                      <>
                        {replies.map((reply) => (
                            <Comment
                              key={reply.id}
                              comment={reply}
                              depth={depth + 1}
                              onReply={onReply}
                              onLike={onLike}
                            />
                        ))}
                        {/* Nút ẩn reply */}
                         <button 
                           onClick={() => setShowNestedReplies(false)}
                           className="text-xs text-muted-foreground hover:underline ml-2 mt-3 block"
                         >
                           Hide replies
                         </button>
                      </>
                   )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}