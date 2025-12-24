import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom'; // [1] Import hook điều hướng
import { createUserProfile } from '../api/user-actions';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export const CompleteProfileForm = () => {
  const [username, setUsername] = useState('');
  const queryClient = useQueryClient();
  const navigate = useNavigate(); // [1] Khởi tạo hook

  const mutation = useMutation({
    mutationFn: createUserProfile,
    onSuccess: () => {
      toast.success('Tạo hồ sơ thành công! Đang chuyển hướng...');
      
      // [2] Thêm Delay 1.5 giây để đảm bảo server xử lý xong và UX mượt hơn
      setTimeout(() => {
        // Refresh lại cache để AppLayout nhận diện được user mới
        queryClient.invalidateQueries({ queryKey: ['current-user'] });
        
        // Chuyển hướng thẳng về trang Home
        navigate('/');
      }, 1500);
    },
    onError: () => {
      toast.error('Username này đã được sử dụng hoặc có lỗi xảy ra.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    mutation.mutate({ username });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <div className="w-full max-w-md p-8 bg-card border border-border rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 text-foreground">Chào mừng bạn mới! 👋</h2>
          <p className="text-muted-foreground">
            Để hoàn tất đăng ký, vui lòng chọn một Username độc đáo cho riêng mình.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-foreground">Username</Label>
            <Input
              id="username"
              placeholder="VD: huyen_chi_123"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              // [3] Fix màu chữ: text-gray-900 để hiển thị rõ trên nền input sáng
              className="text-gray-900 bg-white border-gray-300 focus:border-primary text-lg h-12"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-12 text-base font-semibold" 
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> 
                Đang khởi tạo...
              </>
            ) : 'Hoàn tất & Bắt đầu'}
          </Button>
        </form>
      </div>
    </div>
  );
};