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
      <div className="max-w-4xl mx-auto pt-4">
        {/* [THAY ĐỔI] Container chính: Thêm nền mờ, bo góc và viền */}
        <div className="bg-background/60 backdrop-blur-md rounded-xl border border-border/50 shadow-sm overflow-hidden pb-8">
          
          <div className="relative mb-8">
            {/* Cover Image Placeholder */}
            <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500 w-full object-cover"></div>
            
            {/* Avatar & Info */}
            <div className="absolute -bottom-16 left-8 flex items-end">
              <Avatar className="w-32 h-32 border-4 border-background shadow-md">
                <AvatarImage src={user.avatar} alt={user.displayName} className="object-cover" />
                <AvatarFallback className="text-2xl font-bold bg-muted">
                  {user.displayName?.[0]?.toUpperCase() || 'Avt'}
                </AvatarFallback>
              </Avatar>
            </div>
            
            {/* Edit Button */}
            <div className="absolute bottom-4 right-4 md:static md:flex md:justify-end md:mt-4 md:mr-4">
              <EditProfileDialog 
                user={user} 
                trigger={
                  <Button variant="secondary" className="gap-2 bg-background/80 hover:bg-background">
                    <Settings className="w-4 h-4" />
                    Chỉnh sửa hồ sơ
                  </Button>
                }
              />
            </div>
          </div>

          <div className="mt-20 px-8">
            <h1 className="text-3xl font-bold text-foreground">{user.displayName || user.username}</h1>
            <p className="text-muted-foreground font-medium text-lg">@{user.username}</p>
            
            {user.bio && (
              <div className="mt-4 p-4 rounded-lg bg-background/40 border border-border/30">
                <p className="whitespace-pre-wrap text-foreground/90 leading-relaxed">{user.bio}</p>
              </div>
            )}
            
            <div className="flex gap-6 mt-6 text-sm">
              <div className="flex items-center gap-1">
                <strong className="text-foreground text-base">{user.followersCount || 0}</strong> 
                <span className="text-muted-foreground">người theo dõi</span>
              </div>
              <div className="flex items-center gap-1">
                <strong className="text-foreground text-base">{user.followingCount || 0}</strong> 
                <span className="text-muted-foreground">đang theo dõi</span>
              </div>
            </div>
          </div>
          
          {/* Placeholder cho tab bài viết */}
          <div className="mt-10 px-8">
            <div className="border-t border-border/40 pt-8">
              <h3 className="font-semibold text-xl mb-4 text-foreground">Bài viết</h3>
              <div className="flex flex-col items-center justify-center py-12 text-center rounded-lg border-2 border-dashed border-border/40 bg-background/20">
                <p className="text-muted-foreground">Chưa có bài viết nào.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return <div className="text-center mt-8 text-muted-foreground">Không thể tải thông tin người dùng.</div>;
};