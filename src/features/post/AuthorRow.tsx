import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { User } from '../../lib/types';

interface AuthorRowProps {
  author: User;
  datePublished: string;
  readTime: number;
  onFollowToggle: () => void;
}

export function AuthorRow({ author, datePublished, readTime, onFollowToggle }: AuthorRowProps) {
  const formattedDate = new Date(datePublished).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="flex items-start justify-between gap-4 mb-8 pb-6 border-b">
      <div className="flex items-start gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={author.avatar} alt={author.name} />
          <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div>
          <div className="flex items-center gap-2">
            <span>{author.name}</span>
            <Button
              variant={author.isFollowing ? 'outline' : 'default'}
              size="sm"
              onClick={onFollowToggle}
            >
              {author.isFollowing ? 'Following' : 'Follow'}
            </Button>
          </div>
          
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
            <span>{formattedDate}</span>
            <span>·</span>
            <span>{readTime} min read</span>
          </div>
        </div>
      </div>
    </div>
  );
}
