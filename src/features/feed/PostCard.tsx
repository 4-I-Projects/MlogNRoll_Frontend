import { Heart, MessageCircle, Bookmark, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Button } from '../../ui/button';
import { Post } from '../../features/post/types';
import { ImageWithFallback } from '../../components/common/ImageWithFallback';

interface PostCardProps {
  post: Post;
  onClick: () => void;
}

export function PostCard({ post, onClick }: PostCardProps) {
  const formattedDate = new Date(post.datePublished).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  // [FIX] Lấy tên hiển thị ưu tiên displayName
  const authorName = post.author?.displayName || post.author?.username || 'Unknown';

  return (
    <article className="
        group cursor-pointer 
        p-6 mb-8 
        bg-card 
        rounded-theme 
        border-theme border-theme 
        drop-shadow-theme 
        backdrop-blur-theme
        transition-all duration-300 hover:-translate-y-1
      "
      style={{ clipPath: 'var(--clip-path-style)' }}>
      <div className="flex gap-4">
        <div className="flex-1 min-w-0" onClick={onClick}>
          {/* Author info */}
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="h-6 w-6 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
              <AvatarImage src={post.author?.avatar} alt={authorName} />
              <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-foreground">{authorName}</span>
            <span className="text-sm text-muted-foreground">·</span>
            <span className="text-sm text-muted-foreground">{formattedDate}</span>
          </div>

          {/* Title & Excerpt */}
          <h2 className="mb-2 line-clamp-2 text-xl font-bold text-foreground">
            {post.title}
          </h2>
          <p className="text-muted-foreground line-clamp-3 mb-4">
            {post.excerpt}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{post.readTime} min read</span>
            </div>

            {/* Stats & Actions */}
            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 h-8 hover:bg-primary/10 hover:text-primary rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Heart className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="gap-1 h-8 hover:bg-primary/10 hover:text-primary rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <MessageCircle className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-primary/10 hover:text-primary rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Thumbnail */}
        {post.thumbnail && (
          <div className="w-28 h-28 flex-shrink-0" onClick={onClick}>
            <div className="w-full h-full overflow-hidden rounded-[calc(var(--radius-theme)-4px)]">
               <ImageWithFallback
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          </div>
        )}
      </div>
    </article>
  );
}