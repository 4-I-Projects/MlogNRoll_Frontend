import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { Button } from '@/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { PostCard } from '@/features/feed/PostCard';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { User } from '@/features/auth/types';
import { MapPin, Link as LinkIcon, Calendar, Settings, UserPlus, Check } from 'lucide-react';

// Hooks & Utils
import { useUser } from '@/features/auth/api/get-user';
import { usePosts } from '@/features/post/api/get-posts';
import { useTheme } from '@/context/ThemeContext';
import { themes } from '@/themes';
import { cn } from '@/ui/utils';
import { formatDate } from '@/utils/date';

export function Profile() {
  const navigate = useNavigate();
  const { userId } = useParams(); 
  
  // Context theme
  const { themeId } = useTheme();
  const currentTheme = themes[themeId as keyof typeof themes] || themes.happy;

  const { currentUser } = useOutletContext<{ currentUser: User }>();
  const targetId = userId || currentUser.id;
  const isOwnProfile = currentUser.id === targetId;

  const { data: user, isLoading: isLoadingUser } = useUser(targetId);

  const { data: userPosts, isLoading: isLoadingPosts } = usePosts({ 
    userId: targetId, // [FIX] Dùng userId thay vì authorId cho khớp API mới
    status: 'published'
  });

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-24 w-24 bg-muted rounded-full"></div>
          <div className="h-4 w-48 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold">User not found</h2>
        <Button onClick={() => navigate('/')} variant="link">Go Home</Button>
      </div>
    );
  }

  // [FIX] Dùng displayName thay vì name
  const displayName = user.displayName || user.username;
  const initials = displayName.charAt(0).toUpperCase();

  const stats = [
    { label: 'Stories', value: userPosts?.length || 0 },
    { label: 'Followers', value: user.followersCount || 0 }, // Fallback 0
    { label: 'Following', value: user.followingCount || 0 },
  ];

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      
      {/* 1. PROFILE HEADER CARD */}
      <div 
        className={cn(
          "relative overflow-hidden mb-8",
          "rounded-theme border border-theme shadow-md",
          "bg-background/90 backdrop-blur-xl", // Hiệu ứng kính
        )}
      >
        {/* Cover Photo (Giả lập hoặc lấy từ user nếu có) */}
        <div 
          className="h-32 md:h-48 w-full bg-gradient-to-r from-primary/20 to-primary/5"
          style={{ backgroundColor: currentTheme.accent + '20' }} // Màu nền cover nhẹ theo theme
        />

        <div className="px-6 md:px-10 pb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start -mt-12 md:-mt-16">
            
            {/* Avatar */}
            <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-xl ring-2 ring-border/10">
              <AvatarImage src={user.avatar} alt={displayName} className="object-cover" />
              <AvatarFallback className="text-4xl font-bold bg-muted text-muted-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>

            {/* Info Section */}
            <div className="flex-1 mt-2 md:mt-16 w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">{displayName}</h1>
                  <p className="text-muted-foreground">@{user.username}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {isOwnProfile ? (
                    <Button 
                      variant="outline" 
                      className="gap-2 rounded-full border-theme hover:bg-muted"
                      onClick={() => navigate('/settings')}
                    >
                      <Settings className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  ) : (
                    <Button 
                      className={cn(
                        "gap-2 rounded-full transition-all",
                        user.isFollowing 
                          ? "bg-muted text-foreground hover:bg-muted/80" 
                          : "bg-primary text-primary-foreground hover:opacity-90"
                      )}
                    >
                      {user.isFollowing ? (
                        <><Check className="h-4 w-4" /> Following</>
                      ) : (
                        <><UserPlus className="h-4 w-4" /> Follow</>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {/* Bio */}
              <p className="mt-4 text-base text-foreground/80 leading-relaxed max-w-2xl">
                {user.bio || "This user hasn't written a bio yet."}
              </p>

              {/* Meta Info (Optional - Mockup để đẹp hơn) */}
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>Earth</span>
                </div>
                <div className="flex items-center gap-1">
                  <LinkIcon className="h-4 w-4" />
                  <a href="#" className="hover:text-primary transition-colors">mlognroll.com</a>
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-8 mt-6 pt-6 border-t border-border">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center md:items-start">
                    <span className="text-xl font-bold text-foreground">{stat.value}</span>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CONTENT TABS */}
      <Tabs defaultValue="stories" className="w-full">
        <TabsList className="w-full justify-start border-b border-border bg-transparent p-0 mb-8 rounded-none h-auto">
          <TabsTrigger 
            value="stories" 
            className="rounded-none border-b-2 border-transparent px-4 py-3 font-semibold text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:bg-transparent transition-all"
          >
            Stories
          </TabsTrigger>
          <TabsTrigger 
            value="about" 
            className="rounded-none border-b-2 border-transparent px-4 py-3 font-semibold text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:bg-transparent transition-all"
          >
            About
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stories" className="space-y-6">
          {isLoadingPosts ? (
            <div className="py-20 text-center text-muted-foreground">Loading stories...</div>
          ) : userPosts && userPosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {userPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onClick={() => navigate(`/post/${post.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/30 rounded-theme border border-dashed border-border">
              <p className="text-lg font-medium text-foreground">No stories yet</p>
              <p className="text-muted-foreground">
                {isOwnProfile ? "Start writing your first story today!" : "This user hasn't published any stories."}
              </p>
              {isOwnProfile && (
                <Button className="mt-4" onClick={() => navigate('/editor')}>Write a Story</Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="about">
          <div className="bg-card rounded-theme border border-border p-8 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">About {displayName}</h3>
            <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
              <p>{user.bio || "No description provided."}</p>
              {/* Có thể thêm các field khác như Join Date nếu có */}
              <p className="mt-4 text-xs opacity-70">
                Joined MlogNRoll community via {user.email ? 'Email' : 'Social Login'}.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}