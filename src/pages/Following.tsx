import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { mockUsers } from '../lib/mockData';
import { User } from '@/features/auth/types';

interface FollowingProps {
  onNavigate: (page: string, userId?: string) => void;
}

export function Following({ onNavigate }: FollowingProps) {
  const followingUsers = mockUsers.filter(u => u.isFollowing);
  const suggestedUsers = mockUsers.filter(u => !u.isFollowing);

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2">Following</h1>
        <p className="text-gray-600">
          Manage who you follow and discover new writers
        </p>
      </div>

      <Tabs defaultValue="following" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="following">
            Following ({followingUsers.length})
          </TabsTrigger>
          <TabsTrigger value="followers">
            Followers (123)
          </TabsTrigger>
          <TabsTrigger value="suggested">
            Suggested
          </TabsTrigger>
        </TabsList>

        <TabsContent value="following">
          <div className="grid gap-6 md:grid-cols-2">
            {followingUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="followers">
          <div className="grid gap-6 md:grid-cols-2">
            {mockUsers.slice(0, 3).map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="suggested">
          <div className="grid gap-6 md:grid-cols-2">
            {suggestedUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function UserCard({ user, onNavigate }: { user: User; onNavigate: (page: string, userId?: string) => void }) {
  return (
    <div className="flex gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <Avatar className="h-16 w-16 flex-shrink-0 cursor-pointer" onClick={() => onNavigate('profile', user.id)}>
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <h3 
          className="mb-1 cursor-pointer hover:underline" 
          onClick={() => onNavigate('profile', user.id)}
        >
          {user.name}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {user.bio}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>{user.followersCount} followers</span>
        </div>
      </div>

      <div>
        <Button 
          variant={user.isFollowing ? 'outline' : 'default'}
          size="sm"
        >
          {user.isFollowing ? 'Following' : 'Follow'}
        </Button>
      </div>
    </div>
  );
}
