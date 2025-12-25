import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/features/auth/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { Button } from '@/ui/button';
// [FIX] Chỉ import những gì dùng thực tế. Bỏ 'useFollowers' đi vì trong component này không dùng.
import { useFollowUser, useUnfollowUser, useFollowing } from '@/features/profile/api/follow-api';
import { useCurrentUser } from '@/features/auth/api/get-current-user';

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  const navigate = useNavigate();
  const { data: currentUser } = useCurrentUser();
  
  // Lấy danh sách following của MÌNH để check xem mình đã follow user này chưa
  const { data: myFollowingList, isLoading: isLoadingList } = useFollowing(currentUser?.id || '');
  
  // Ép kiểu String để so sánh an toàn
  const isFollowingServer = myFollowingList?.some((u: User) => String(u.id) === String(user.id)) ?? false;
  
  const [isFollowingOptimistic, setIsFollowingOptimistic] = useState(isFollowingServer);

  // Chỉ update state khi list tải xong
  useEffect(() => {
    if (!isLoadingList && myFollowingList) {
        setIsFollowingOptimistic(isFollowingServer);
    }
  }, [isFollowingServer, isLoadingList, myFollowingList]);

  const isMe = currentUser?.id === String(user.id);

  const followMutation = useFollowUser();
  const unfollowMutation = useUnfollowUser();
  const isMutating = followMutation.isPending || unfollowMutation.isPending;

  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return navigate('/login');

    const newStatus = !isFollowingOptimistic;
    setIsFollowingOptimistic(newStatus); // Đổi màu nút ngay lập tức

    if (isFollowingOptimistic) {
      unfollowMutation.mutate(user.id, {
        onError: () => setIsFollowingOptimistic(true) // Revert nếu lỗi
      });
    } else {
      followMutation.mutate(user.id, {
        onError: () => setIsFollowingOptimistic(false) // Revert nếu lỗi
      });
    }
  };

  const displayName = user.displayName || user.username || 'User';

  return (
    <div 
      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/40 transition-colors bg-card cursor-pointer group"
      onClick={() => navigate(`/profile/${user.id}`)}
    >
      <Avatar className="h-14 w-14 border border-border group-hover:border-primary/50 transition-colors">
        <AvatarImage src={user.avatar} alt={displayName} />
        <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm truncate text-foreground group-hover:text-primary transition-colors">
          {displayName}
        </h4>
        <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
        <div className="flex items-center gap-2 mt-1">
           {/* Chỉ hiện followers count nếu có số liệu hợp lệ */}
           {typeof user.followersCount === 'number' && user.followersCount > 0 && (
             <span className="text-xs text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
               {user.followersCount} followers
             </span>
           )}
        </div>
      </div>

      {!isMe && (
        <Button 
          variant={isFollowingOptimistic ? 'outline' : 'default'} 
          size="sm"
          className={`h-8 px-4 transition-all duration-200 ${
            isFollowingOptimistic 
              ? 'text-muted-foreground hover:text-destructive hover:border-destructive hover:bg-destructive/10' 
              : 'hover:scale-105'
          }`}
          onClick={handleFollowClick}
          disabled={isMutating}
        >
          {isMutating ? '...' : (isFollowingOptimistic ? 'Following' : 'Follow')}
        </Button>
      )}
    </div>
  );
}