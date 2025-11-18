import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { Button } from '@/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { PostCard } from '@/features/feed/PostCard';
import { User } from '@/features/auth/types';
import { mockPosts, mockUsers } from '@/lib/mockData';
import { useNavigate, useParams } from 'react-router-dom'; // [MỚI]

// [XÓA] interface ProfileProps

export function Profile() {
  const navigate = useNavigate(); // [MỚI]
  const { userId } = useParams(); // [MỚI]

  // Logic lấy user: nếu có userId trên URL thì tìm, không thì lấy user mặc định (mockUsers[0])
  const user: User = userId ? mockUsers.find(u => u.id === userId) || mockUsers[0] : mockUsers[0];
  const userPosts = mockPosts.filter(post => post.authorId === user.id);
  
  const stats = [
    { label: 'Stories', value: userPosts.length },
    { label: 'Followers', value: user.followersCount },
    { label: 'Following', value: user.followingCount },
  ];

  return (
    <div>
      {/* Profile Header */}
      <div className="border-b pb-8 mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h1 className="mb-2">{user.name}</h1>
            <p className="text-gray-600 mb-4">{user.bio}</p>

            <div className="flex items-center gap-6 mb-4">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-gray-600">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button variant={user.isFollowing ? 'outline' : 'default'}>
                {user.isFollowing ? 'Following' : 'Follow'}
              </Button>
              <Button variant="outline" onClick={() => navigate('/settings')}>
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <Tabs defaultValue="stories" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="stories">Stories</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        <TabsContent value="stories">
          {userPosts.length > 0 ? (
            <div>
              {userPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onClick={() => navigate(`/post/${post.id}`)} // [SỬA]
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500">No stories published yet</p>
            </div>
          )}
        </TabsContent>

        {/* TabsContent value="about" giữ nguyên */}
        <TabsContent value="about">
             {/* ... Code cũ giữ nguyên ... */}
              <div className="max-w-2xl">
            <h3 className="mb-4">About {user.name}</h3>
            <p className="text-gray-600 mb-6">{user.bio}</p>

            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Member since</div>
                <div>January 2024</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 mb-1">Location</div>
                <div>San Francisco, CA</div>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-1">Website</div>
                <a href="#" className="text-blue-600 hover:underline">
                  example.com
                </a>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}