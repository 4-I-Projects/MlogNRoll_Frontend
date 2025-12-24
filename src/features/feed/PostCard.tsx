// src/features/feed/PostCard.tsx
import { Heart, MessageCircle, Bookmark } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { Button } from '@/ui/button';
import { Post } from '@/features/post/types';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { formatDate } from '@/utils/date';
import { cn } from '@/ui/utils';

interface PostCardProps {
  post: Post;
  onClick: () => void;
}

export function PostCard({ post, onClick }: PostCardProps) {
  const formattedDate = formatDate(post.datePublished);
  const authorName = post.author?.displayName || post.author?.username || 'Unknown';

  return (
    <article 
      onClick={onClick}
      className={cn(
        "group cursor-pointer p-6 mb-6",
        // [DESIGN UPDATE] Áp dụng style kính mờ giống trang Stories
        "bg-[var(--story-item-bg)] hover:bg-[var(--hover-item-bg)]", // Nền theo theme
        "backdrop-blur-sm", // Hiệu ứng mờ
        "rounded-lg border border-theme", // Viền và bo góc
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" // Hiệu ứng hover
      )}
    >
      <div className="flex gap-4">
        <div className="flex-1 min-w-0">
          {/* Header: Author Info */}
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="h-6 w-6 ring-2 ring-transparent group-hover:ring-theme/20 transition-all">
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
            {post.excerpt}
          </p>

          {/* Footer: Stats & Actions */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="bg-muted/50 px-2 py-1 rounded-md">{post.readTime || '5'} min read</span>
              {/* Có thể thêm views ở đây nếu muốn */}
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full hover:bg-theme/10 hover:text-primary"
                onClick={(e) => { e.stopPropagation(); /* Logic like */ }}
              >
                <Heart className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full hover:bg-theme/10 hover:text-primary"
                onClick={(e) => { e.stopPropagation(); /* Logic comment */ }}
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full hover:bg-theme/10 hover:text-primary"
                onClick={(e) => { e.stopPropagation(); /* Logic save */ }}
              >
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