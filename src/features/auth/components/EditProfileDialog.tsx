import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserProfile, UpdateUserDTO } from '../api/user-actions';
import { User } from '../types';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/ui/dialog';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Textarea } from '@/ui/textarea';
import { toast } from 'sonner';

interface EditProfileDialogProps {
  user: User;
  trigger: React.ReactNode;
}

export const EditProfileDialog = ({ user, trigger }: EditProfileDialogProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  // Khởi tạo state từ dữ liệu user hiện tại
  const [formData, setFormData] = useState<UpdateUserDTO>({
    username: user.username || '',
    display_name: user.displayName || '', // Lưu ý mapping field name
    bio: user.bio || '',
    avatar_url: user.avatar || '',
  });

  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      toast.success('Cập nhật hồ sơ thành công!');
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
      setOpen(false);
    },
    onError: () => {
      toast.error('Cập nhật thất bại.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa hồ sơ</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="display_name">Tên hiển thị</Label>
            <Input
              id="display_name"
              value={formData.display_name}
              onChange={(e) => setFormData({...formData, display_name: e.target.value})}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="avatar">Avatar URL</Label>
            <Input
              id="avatar"
              value={formData.avatar_url}
              onChange={(e) => setFormData({...formData, avatar_url: e.target.value})}
            />
          </div>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};