import { useState, useRef } from 'react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { toast } from 'sonner';
import { Camera, Loader2, Upload } from 'lucide-react';
import { uploadImage } from '@/features/post/api/upload-image';

interface EditProfileDialogProps {
  user: User;
  trigger: React.ReactNode;
}

export const EditProfileDialog = ({ user, trigger }: EditProfileDialogProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<UpdateUserDTO>({
    username: user.username || '',
    display_name: user.displayName || '',
    bio: user.bio || '',
    avatar_url: user.avatar || '',
  });

  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      toast.success('Cập nhật hồ sơ thành công!');
      
      queryClient.setQueryData(['current-user'], (oldData: User | undefined) => {
        if (!oldData) return undefined;
        return {
          ...oldData,
          displayName: formData.display_name,
          username: formData.username,
          bio: formData.bio,
          avatar: formData.avatar_url,
        };
      });

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

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        toast.error("Vui lòng chỉ chọn file ảnh!");
        return;
    }
    if (file.size > 5 * 1024 * 1024) { 
        toast.error("Ảnh quá lớn! Vui lòng chọn ảnh dưới 5MB.");
        return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Đang tải ảnh lên...");

    try {
        const url = await uploadImage(file);
        setFormData(prev => ({ ...prev, avatar_url: url }));
        toast.success("Tải ảnh thành công!", { id: toastId });
    } catch (error) {
        console.error(error);
        toast.error("Lỗi upload ảnh.", { id: toastId });
    } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      
      {/* [FIX] Thêm bg-white, text-gray-900 để đảm bảo nền trắng chữ đen dễ đọc */}
      <DialogContent className="sm:max-w-[425px] bg-white text-gray-900 border-gray-200 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">Chỉnh sửa hồ sơ</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
                <Avatar className="h-24 w-24 border-2 border-gray-200 shadow-sm">
                    <AvatarImage src={formData.avatar_url} className="object-cover" />
                    <AvatarFallback className="text-2xl font-bold bg-gray-100 text-gray-600">
                        {formData.display_name?.charAt(0) || user.username.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                
                <div 
                    className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={!isUploading ? handleTriggerUpload : undefined}
                >
                    {isUploading ? (
                        <Loader2 className="h-8 w-8 text-white animate-spin" />
                    ) : (
                        <Camera className="h-8 w-8 text-white" />
                    )}
                </div>
            </div>

            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleAvatarUpload}
            />

            <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleTriggerUpload}
                disabled={isUploading}
                // [FIX] Nút upload rõ ràng hơn trên nền trắng
                className="gap-2 bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            >
                {isUploading ? 'Uploading...' : (
                    <>
                        <Upload className="h-4 w-4" /> Change Avatar
                    </>
                )}
            </Button>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="display_name" className="text-gray-700 font-medium">Tên hiển thị</Label>
            <Input
              id="display_name"
              value={formData.display_name}
              onChange={(e) => setFormData({...formData, display_name: e.target.value})}
              // [FIX] Style input chuẩn nền trắng, viền xám
              className="bg-white text-gray-900 border-gray-300 focus:border-black focus:ring-1 focus:ring-black placeholder:text-gray-400"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="username" className="text-gray-700 font-medium">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              // [FIX] Style input chuẩn nền trắng, viền xám
              className="bg-white text-gray-900 border-gray-300 focus:border-black focus:ring-1 focus:ring-black placeholder:text-gray-400"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="bio" className="text-gray-700 font-medium">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              // [FIX] Style textarea chuẩn nền trắng, viền xám
              className="resize-none min-h-[80px] bg-white text-gray-900 border-gray-300 focus:border-black focus:ring-1 focus:ring-black placeholder:text-gray-400"
            />
          </div>

          <Button 
            type="submit" 
            disabled={mutation.isPending || isUploading}
            className="bg-black text-white hover:bg-gray-800 font-medium"
          >
            {(mutation.isPending || isUploading) ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
            ) : 'Lưu thay đổi'}
          </Button>

        </form>
      </DialogContent>
    </Dialog>
  );
};