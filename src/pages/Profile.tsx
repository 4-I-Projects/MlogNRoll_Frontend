import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { Button } from '@/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { PostCard } from '@/features/feed/PostCard';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { User } from '@/features/auth/types';

// [MỚI] Imports hooks
import { useUser } from '@/features/auth/api/get-user';
import { usePosts } from '@/features/post/api/get-posts';

export function Profile() {
  const navigate = useNavigate();
  const { userId } = useParams(); 
  
  // Lấy currentUser từ context (AppLayout truyền xuống) nếu đang xem profile chính mình
  const { currentUser } = useOutletContext<{ currentUser: User }>();

  // Xác định ID cần fetch: nếu không có userId trên URL -> xem profile chính mình
  const targetId = userId || currentUser.id;

  // 1. Fetch User Info
  const { data: user, isLoading: isLoadingUser } = useUser(targetId);

  // 2. Fetch User Posts
  const { data: userPosts, isLoading: isLoadingPosts } = usePosts({ 
    authorId: targetId,
    status: 'published' // Chỉ lấy bài đã public
  });

  if (isLoadingUser) return <div className="text-center py-20">Loading profile...</div>;

  // Nếu không tìm thấy user hoặc lỗi
  if (!user) return <div className="text-center py-20">User not found</div>;

  const stats = [
    { label: 'Stories', value: userPosts?.length || 0 },
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
            <h1 className="mb-2 text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-600 mb-4">{user.bio || "No bio yet."}</p>

            <div className="flex items-center gap-6 mb-4">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-gray-900 font-semibold">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              {/* Nếu là profile của chính mình thì hiện nút Edit, ngược lại hiện nút Follow */}
              {currentUser.id === user.id ? (
                <Button variant="outline" onClick={() => navigate('/settings')}>
                  Edit Profile
                </Button>
              ) : (
                <Button variant={user.isFollowing ? 'outline' : 'default'}>
                  {user.isFollowing ? 'Following' : 'Follow'}
                </Button>
              )}
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
          {isLoadingPosts ? (
            <div className="py-10 text-center">Loading stories...</div>
          ) : userPosts && userPosts.length > 0 ? (
            <div>
              {userPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onClick={() => navigate(`/post/${post.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500">No stories published yet</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="about">
          <div className="max-w-2xl">
            <h3 className="mb-4 font-semibold">About {user.name}</h3>
            <p className="text-gray-600 mb-6">{user.bio}</p>
            {/* Các thông tin khác nếu API trả về... */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}