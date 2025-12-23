import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUserProfile } from '../api/user-actions';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { toast } from 'sonner';

export const CompleteProfileForm = () => {
  const [username, setUsername] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createUserProfile,
    onSuccess: () => {
      toast.success('Tạo hồ sơ thành công!');
      // Refresh lại data user để app tự động chuyển sang màn hình chính
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
    },
    onError: () => {
      toast.error('Có lỗi xảy ra, username có thể đã tồn tại.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    mutation.mutate({ username });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
      <div className="w-full max-w-md p-6 bg-background border border-border rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-2 text-center">Hoàn thiện hồ sơ</h2>
        <p className="text-muted-foreground text-center mb-6">
          Vui lòng đặt Username để bắt đầu sử dụng Mlog.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Ví dụ: huy_gay_88"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Đang tạo...' : 'Hoàn tất đăng ký'}
          </Button>
        </form>
      </div>
    </div>
  );
};