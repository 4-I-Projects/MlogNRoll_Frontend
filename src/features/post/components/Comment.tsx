import { useState } from 'react';
import { CornerDownRight, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { Button } from '@/ui/button';
import { Textarea } from '@/ui/textarea';
import { formatDate } from '@/utils/date';
import { Comment as IComment } from '@/features/post/api/comment-api';
import { useQuery } from '@tanstack/react-query';
import { getReplies } from '@/features/post/api/comment-api';
import { cn } from '@/ui/utils'; // Import cn để merge class

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
  const [showNestedReplies, setShowNestedReplies] = useState(false);

  const [isLiked, setIsLiked] = useState(comment.isLiked || false);
  const [likes, setLikes] = useState(comment.likeCount);

  // Fetch replies
  const { 
    data: repliesData, 
    isLoading: isLoadingReplies, 
    refetch: fetchReplies 
  } = useQuery({
    queryKey: ['replies', comment.id],
    queryFn: () => getReplies(comment.id),
    enabled: false, 
  });

  const replies = repliesData?.data || comment.replies || [];
  const hasReplies = comment.replyCount > 0 || replies.length > 0;

  const handleToggleReplies = () => {
    if (!showNestedReplies && !repliesData && comment.replyCount > 0) {
       fetchReplies(); 
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
      onReply(comment.id, replyContent);
      setReplyContent('');
      setIsReplying(false);
      
      // [FIX] Mở list reply ngay lập tức để khi query invalidate xong, nó tự fetch và hiện ra
      setShowNestedReplies(true); 
    }
  };

  const formattedDate = formatDate(comment.createdAt);
  const displayName = comment.user?.username || 'Unknown';
  const avatarUrl = comment.user?.avatarUrl;

  return (
    <div className={cn("group animate-in fade-in duration-300", depth > 0 && "mt-3")}>
      <div className="flex gap-3 py-1">
        {/* Avatar: Nhỏ dần khi depth tăng */}
        <Avatar className={cn("flex-shrink-0 mt-1", depth > 0 ? "h-7 w-7" : "h-9 w-9")}>
          <AvatarImage src={avatarUrl || undefined} alt={displayName} />
          <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          {/* Bubble nội dung */}
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
                className={cn("font-semibold hover:underline", isLiked && "text-red-500")}
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

          {/* Form Reply */}
          {isReplying && (
            <div className="mt-3 flex gap-3 animate-in slide-in-from-top-2 duration-200">
               {/* Line visual guide cho form reply */}
               <div className="w-8 border-l-2 border-border/50 rounded-bl-lg ml-4"></div>
               
               <div className="flex-1 flex gap-2">
                  <Textarea
                    placeholder={`Reply to ${displayName}...`}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="min-h-[40px] text-sm resize-none bg-background text-foreground"
                    autoFocus
                  />
                  <Button size="sm" onClick={handleSubmitReply}>Send</Button>
               </div>
            </div>
          )}

          {/* --- KHU VỰC HIỂN THỊ REPLY (QUAN TRỌNG) --- */}
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
                // [FIX UI] Thêm padding-left và border để tạo hiệu ứng cây phân cấp
                <div className="relative pl-4 mt-2">
                   {/* Đường kẻ dọc nối các reply */}
                   <div className="absolute left-0 top-0 bottom-4 w-px bg-border/50 ml-1"></div>

                   {isLoadingReplies ? (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground ml-2 mt-2">
                        <Loader2 className="h-3 w-3 animate-spin" /> Loading replies...
                      </div>
                   ) : (
                      <div className="space-y-4"> {/* Tăng khoảng cách giữa các reply con */}
                        {replies.map((reply) => (
                            <Comment
                              key={reply.id}
                              comment={reply}
                              depth={depth + 1}
                              onReply={onReply}
                              onLike={onLike}
                            />
                        ))}
                         <button 
                           onClick={() => setShowNestedReplies(false)}
                           className="text-xs text-muted-foreground hover:underline ml-4 mt-2 block relative z-10"
                         >
                           Hide replies
                         </button>
                      </div>
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