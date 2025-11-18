import { Heart, MessageCircle, Bookmark, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
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

  return (
    <article className="group cursor-pointer border-b py-6 hover:bg-gray-50/50 transition-colors">
      <div className="flex gap-4">
        <div className="flex-1 min-w-0" onClick={onClick}>
          {/* Author info */}
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="h-6 w-6">
              <AvatarImage src={post.author?.avatar} alt={post.author?.name} />
              <AvatarFallback>{post.author?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{post.author?.name}</span>
            <span className="text-sm text-gray-400">·</span>
            <span className="text-sm text-gray-500">{formattedDate}</span>
          </div>

          {/* Title & Excerpt */}
          <h2 className="mb-2 line-clamp-2">
            {post.title}
          </h2>
          <p className="text-gray-600 line-clamp-3 mb-4">
            {post.excerpt}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Tags */}
              <div className="flex gap-2">
                {post.tags.slice(0, 2).map((tag, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              {/* Read time */}
              <span className="text-sm text-gray-500">{post.readTime} min read</span>
            </div>

            {/* Stats & Actions */}
            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-1 h-8"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Heart className="h-4 w-4" />
                <span className="text-xs">{post.stats.likes}</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-1 h-8"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs">{post.stats.comments}</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Bookmark className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Thumbnail */}
        {post.thumbnail && (
          <div className="w-28 h-28 flex-shrink-0" onClick={onClick}>
            <ImageWithFallback
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-full object-cover rounded"
            />
          </div>
        )}
      </div>
    </article>
  );
}
