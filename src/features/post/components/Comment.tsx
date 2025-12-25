import { useState, useRef } from 'react';
import { CornerDownRight, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { Button } from '@/ui/button';
import { Textarea } from '@/ui/textarea';
import { formatDate } from '@/utils/date';
import { Comment as IComment } from '@/features/post/api/comment-api';
import { useQuery } from '@tanstack/react-query';
import { getReplies } from '@/features/post/api/comment-api';
import { cn } from '@/ui/utils';
// Hook lấy user chi tiết
import { useUser } from '@/features/auth/api/get-user';

interface CommentProps {
  comment: IComment;
  depth?: number;
  onReply: (parentId: string, content: string) => void;
  onLike?: (commentId: string) => void;
  onLoadReplies?: (commentId: string) => void; 
}

export function Comment({ comment, depth = 0, onReply, onLike }: CommentProps) {
  // 1. Gọi API User
  // [SAFETY] Kiểm tra userId có tồn tại không trước khi gọi hook
  const safeUserId = comment.userId || (comment as any).user?.id || ''; 
  const { data: userProfile, isLoading: isLoadingUser } = useUser(safeUserId);

  // 2. Logic hiển thị an toàn (Safe Navigation)
  // [FIX] Thêm ?. vào fallbackUser để tránh crash nếu dữ liệu cũ trong cache chưa có trường này
  const displayName = userProfile?.displayName || 
                      userProfile?.username || 
                      comment.fallbackUser?.displayName || 
                      (comment as any).user?.displayName || // Fallback cho cache cũ
                      'Unknown User';

  const avatarUrl = userProfile?.avatar || 
                    comment.fallbackUser?.avatarUrl || 
                    (comment as any).user?.avatarUrl;

  const usernameChar = displayName.charAt(0).toUpperCase();

  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [showNestedReplies, setShowNestedReplies] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isLiked, setIsLiked] = useState(comment.isLiked || false);
  const [likes, setLikes] = useState(comment.likeCount);

  const { 
    data: repliesData, 
    isLoading: isLoadingReplies, 
    refetch: fetchReplies 
  } = useQuery({
    queryKey: ['replies', comment.id],
    queryFn: () => getReplies(comment.id),
    enabled: showNestedReplies, 
  });

  const replies = repliesData?.data || comment.replies || [];
  const hasReplies = comment.replyCount > 0 || replies.length > 0;
  const formattedDate = formatDate(comment.createdAt);

  const handleReplyClick = () => {
    setIsReplying(!isReplying);
    if (!isReplying) {
      setReplyContent(depth > 0 ? `@${displayName} ` : '');
      setTimeout(() => {
        textareaRef.current?.focus();
        textareaRef.current?.setSelectionRange(textareaRef.current.value.length, textareaRef.current.value.length);
      }, 100);
    }
  };

  const handleSubmitReply = () => {
    if (replyContent.trim()) {
      const rootParentId = depth === 0 ? comment.id : comment.parentId;
      if (rootParentId) {
        onReply(rootParentId, replyContent);
        setReplyContent('');
        setIsReplying(false);
        if (depth === 0) setShowNestedReplies(true);
      }
    }
  };

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

  return (
    <div className={cn("group animate-in fade-in duration-300", depth > 0 && "mt-3")}>
      <div className="flex gap-3 py-1">
        
        {/* Avatar */}
        <Avatar className={cn("flex-shrink-0 mt-1 cursor-pointer", depth > 0 ? "h-7 w-7" : "h-9 w-9")}>
          <AvatarImage src={avatarUrl || undefined} alt={displayName} />
          <AvatarFallback>{usernameChar}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="bg-secondary/50 rounded-2xl px-4 py-2 inline-block max-w-full">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-sm font-semibold text-foreground">
                {/* Check an toàn khi render */}
                {isLoadingUser && !displayName ? 'Loading...' : displayName}
              </span>
            </div>
            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
              {comment.content}
            </p>
          </div>

          <div className="flex items-center gap-4 mt-1 ml-2 text-xs text-muted-foreground">
             <span>{formattedDate}</span>
             <button onClick={handleLike} className={cn("font-semibold hover:underline", isLiked && "text-red-500")}>
                {isLiked ? 'Liked' : 'Like'} {likes > 0 && `(${likes})`}
             </button>
             <button onClick={handleReplyClick} className="font-semibold hover:underline">
                Reply
             </button>
          </div>

          {isReplying && (
            <div className="mt-3 flex gap-3 animate-in slide-in-from-top-2 duration-200">
               <div className="w-8 border-l-2 border-border/50 rounded-bl-lg ml-4"></div>
               <div className="flex-1 flex gap-2">
                  <Textarea
                    ref={textareaRef}
                    placeholder={depth > 0 ? `Replying to ${displayName}...` : "Write a reply..."}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="min-h-[40px] text-sm resize-none bg-background text-foreground"
                  />
                  <Button size="sm" onClick={handleSubmitReply}>Send</Button>
               </div>
            </div>
          )}

          {hasReplies && (
            <div className="mt-2">
              {!showNestedReplies ? (
                <button onClick={handleToggleReplies} className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors ml-1">
                   <CornerDownRight className="h-3 w-3" />
                   View {comment.replyCount || replies.length} replies
                </button>
              ) : (
                <div className="relative pl-4 mt-2">
                   <div className="absolute left-0 top-0 bottom-4 w-px bg-border/50 ml-1"></div>
                   {isLoadingReplies ? (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground ml-2 mt-2">
                        <Loader2 className="h-3 w-3 animate-spin" /> Loading replies...
                      </div>
                   ) : (
                      <div className="space-y-4">
                        {replies.map((reply) => (
                            <Comment
                              key={reply.id}
                              comment={reply}
                              depth={depth + 1}
                              onReply={onReply}
                              onLike={onLike}
                            />
                        ))}
                         <button onClick={() => setShowNestedReplies(false)} className="text-xs text-muted-foreground hover:underline ml-4 mt-2 block relative z-10">
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