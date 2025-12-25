import { Loader2 } from 'lucide-react';
import { useFollowers, useFollowing } from '../api/follow-api';
// [MỚI] Import UserCard chung
import { UserCard } from './UserCard';

interface FollowListProps {
  userId: string;
  type: 'followers' | 'following';
}

export function FollowList({ userId, type }: FollowListProps) {
  const { data: users, isLoading, error } = type === 'followers' 
    ? useFollowers(userId) 
    : useFollowing(userId);

  if (isLoading) {
    return <div className="flex justify-center py-8"><Loader2 className="animate-spin h-6 w-6 text-muted-foreground" /></div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Không thể tải danh sách.</div>;
  }

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground bg-secondary/20 rounded-lg">
        {type === 'followers' ? 'Chưa có người theo dõi nào.' : 'Chưa theo dõi ai.'}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {users.map((user) => (
        // [FIX] Dùng UserCard để có nút Follow/Unfollow
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}