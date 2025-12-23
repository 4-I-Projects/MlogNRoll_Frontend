import { useCurrentUser } from '@/features/auth/api/get-current-user';
import { CompleteProfileForm } from '@/features/auth/components/CompleteProfileForm';
import { EditProfileDialog } from '@/features/auth/components/EditProfileDialog';
import { Button } from '@/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { Settings } from 'lucide-react';

export const Profile = () => {
  const { data: user, isLoading, error } = useCurrentUser();

  if (isLoading) {
    return <div className="flex justify-center p-8">Đang tải...</div>;
  }

  // LOGIC QUAN TRỌNG: Kiểm tra lỗi để xác định User chưa tồn tại trong DB
  // Giả sử API get-current-user trả về error khi status != 200
  // Nếu dùng axios interceptor, error sẽ chứa response
  const isUserNotFound = error && (
    (error as any).response?.status === 404 || 
    (error as any).response?.status === 500
  );

  // TRƯỜNG HỢP 1: User chưa có trong DB -> Hiện form tạo mới
  if (isUserNotFound || (!user && error)) {
    return <CompleteProfileForm />;
  }

  // TRƯỜNG HỢP 2: Đã có User -> Hiện giao diện Profile bình thường
  if (user) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="relative mb-8">
          {/* Cover Image Placeholder */}
          <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg w-full object-cover"></div>
          
          {/* Avatar & Info */}
          <div className="absolute -bottom-16 left-8 flex items-end">
            <Avatar className="w-32 h-32 border-4 border-background">
              <AvatarImage src={user.avatar} alt={user.displayName} className="object-cover" />
              <AvatarFallback className="text-2xl">{user.displayName?.[0] || 'Avt'}</AvatarFallback>
            </Avatar>
          </div>
          
          {/* Edit Button */}
          <div className="absolute bottom-4 right-4 md:static md:flex md:justify-end md:mt-4">
            <EditProfileDialog 
              user={user} 
              trigger={
                <Button variant="outline" className="gap-2">
                  <Settings className="w-4 h-4" />
                  Chỉnh sửa hồ sơ
                </Button>
              }
            />
          </div>
        </div>

        <div className="mt-20 px-8">
          <h1 className="text-2xl font-bold">{user.displayName || user.username}</h1>
          <p className="text-muted-foreground">@{user.username}</p>
          
          {user.bio && (
            <div className="mt-4">
              <p className="whitespace-pre-wrap">{user.bio}</p>
            </div>
          )}
          
          <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
            <span><strong>{user.followersCount || 0}</strong> người theo dõi</span>
            <span><strong>{user.followingCount || 0}</strong> đang theo dõi</span>
          </div>
        </div>
        
        {/* Placeholder cho tab bài viết */}
        <div className="mt-8 px-8 border-t pt-8">
          <h3 className="font-semibold text-lg mb-4">Bài viết</h3>
          <p className="text-muted-foreground">Chưa có bài viết nào.</p>
        </div>
      </div>
    );
  }

  return <div>Không thể tải thông tin người dùng.</div>;
};