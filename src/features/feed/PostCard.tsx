import { Heart, MessageCircle, Bookmark } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { Button } from '@/ui/button';
import { Post } from '@/features/post/types';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { formatDate } from '@/utils/date';
import { cn } from '@/ui/utils';
import { useMemo } from 'react';

interface PostCardProps {
  post: Post;
  onClick: () => void;
}

export function PostCard({ post, onClick }: PostCardProps) {
  const formattedDate = formatDate(post.datePublished);
  const authorName = post.author?.displayName || post.author?.username || 'Unknown';

  // [FIX] Sửa 'post.body' thành 'post.content' để khớp với Type Post và dữ liệu đã map
  const plainExcerpt = useMemo(() => {
    const htmlContent = post.excerpt || post.content || ""; 
    
    // Dùng DOMParser để loại bỏ thẻ HTML an toàn
    const doc = new DOMParser().parseFromString(htmlContent, "text/html");
    return doc.body.textContent || "";
  }, [post.excerpt, post.content]);

  return (
    <article 
      onClick={onClick}
      className={cn(
        "group cursor-pointer p-6 mb-6",
        "bg-[var(--story-item-bg)] hover:bg-[var(--hover-item-bg)]", 
        "backdrop-blur-sm", 
        "rounded-lg border border-theme", 
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" 
      )}
    >
      <div className="flex gap-4">
        <div className="flex-1 min-w-0">
          {/* Header: Author Info */}
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="h-6 w-6 ring-2 ring-transparent group-hover:ring-theme/20 transition-all">
              {/* Avatar Image đã được map đúng ở API */}
              <AvatarImage src={post.author?.avatar} alt={authorName} />
              <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-foreground">{authorName}</span>
            <span className="text-sm text-muted-foreground">·</span>
            <span className="text-sm text-muted-foreground">{formattedDate}</span>
          </div>

          {/* Body: Title & Excerpt */}
          <h2 className="mb-2 line-clamp-2 text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            {post.title}
          </h2>
          
          <p className="text-muted-foreground line-clamp-3 mb-4 text-sm leading-relaxed">
            {plainExcerpt}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="bg-muted/50 px-2 py-1 rounded-md">{post.readTime || '5'} min read</span>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-theme/10 hover:text-primary">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-theme/10 hover:text-primary">
                <MessageCircle className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-theme/10 hover:text-primary">
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Thumbnail */}
        {post.thumbnail && (
          <div className="w-32 h-32 flex-shrink-0 hidden sm:block">
            <div className="w-full h-full overflow-hidden rounded-md border border-border/50">
               <ImageWithFallback
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        )}
      </div>
    </article>
  );
}