import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { Button } from '@/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { User } from '@/features/auth/types';
import { useNavigate, useOutletContext } from 'react-router-dom';

// [MỚI] Hooks
import { useFollowers, useFollowing } from '@/features/auth/api/get-follows';
import { useUsers } from '@/features/auth/api/get-users';

export function Following() {
  const { currentUser } = useOutletContext<{ currentUser: User }>();
  const userId = currentUser?.id || '';

  const { data: followingData, isLoading: loadFollowing } = useFollowing(userId);
  const followingUsers = followingData?.data || [];

  const { data: followersData, isLoading: loadFollowers } = useFollowers(userId);
  const followersUsers = followersData?.data || [];

  const { data: suggestedUsers, isLoading: loadSuggested } = useUsers();

  if (!userId) return <div className="py-10 text-center">Please login to view this page.</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold">Following</h1>
        <p className="text-gray-600">Manage who you follow and discover new writers</p>
      </div>

      <Tabs defaultValue="following" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="following">Following ({followingUsers.length})</TabsTrigger>
          <TabsTrigger value="followers">Followers ({followersUsers.length})</TabsTrigger>
          <TabsTrigger value="suggested">Suggested</TabsTrigger>
        </TabsList>

        <TabsContent value="following">
          {loadFollowing ? <div>Loading...</div> : (
            <div className="grid gap-6 md:grid-cols-2">
              {followingUsers.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
              {followingUsers.length === 0 && <p className="text-gray-500">You are not following anyone yet.</p>}
            </div>
          )}
        </TabsContent>

        <TabsContent value="followers">
          {loadFollowers ? <div>Loading...</div> : (
            <div className="grid gap-6 md:grid-cols-2">
              {followersUsers.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
              {followersUsers.length === 0 && <p className="text-gray-500">No followers yet.</p>}
            </div>
          )}
        </TabsContent>

        <TabsContent value="suggested">
          {loadSuggested ? <div>Loading...</div> : (
            <div className="grid gap-6 md:grid-cols-2">
              {suggestedUsers?.slice(0, 10).map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function UserCard({ user }: { user: User }) {
  const navigate = useNavigate(); 
  
  return (
    <div className="flex gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <Avatar className="h-16 w-16 flex-shrink-0 cursor-pointer" onClick={() => navigate(`/profile/${user.id}`)}>
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <h3 
          className="mb-1 font-medium cursor-pointer hover:underline" 
          onClick={() => navigate(`/profile/${user.id}`)}
        >
          {user.name}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {user.bio || "No bio available"}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>{user.followersCount || 0} followers</span>
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