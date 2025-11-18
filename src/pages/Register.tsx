import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterProps {
  onNavigate: (page: string) => void;
  onRegisterSuccess?: () => void;
}

export function Register({ onNavigate, onRegisterSuccess }: RegisterProps) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<RegisterFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Register data:', data);
      // Call success callback if provided
      if (onRegisterSuccess) {
        onRegisterSuccess();
      } else {
        // Default: navigate to home
        onNavigate('home');
      }
    } catch (error) {
      console.error('Register error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const password = form.watch('password');

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-[#D4A574] shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-black text-center">
            Đăng ký
          </CardTitle>
          <CardDescription className="text-center text-black/70">
            Tạo tài khoản mới để bắt đầu sử dụng dịch vụ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                rules={{
                  required: 'Họ tên là bắt buộc',
                  minLength: {
                    value: 2,
                    message: 'Họ tên phải có ít nhất 2 ký tự',
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">Họ và tên</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Nguyễn Văn A"
                        className="bg-white border-[#D4A574] text-black placeholder:text-black/50 focus-visible:border-[#C49564] focus-visible:ring-[#C49564]/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                rules={{
                  required: 'Email là bắt buộc',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email không hợp lệ',
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        className="bg-white border-[#D4A574] text-black placeholder:text-black/50 focus-visible:border-[#C49564] focus-visible:ring-[#C49564]/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                rules={{
                  required: 'Mật khẩu là bắt buộc',
                  minLength: {
                    value: 6,
                    message: 'Mật khẩu phải có ít nhất 6 ký tự',
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">Mật khẩu</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="bg-white border-[#D4A574] text-black placeholder:text-black/50 focus-visible:border-[#C49564] focus-visible:ring-[#C49564]/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                rules={{
                  required: 'Vui lòng xác nhận mật khẩu',
                  validate: (value: string) =>
                    value === password || 'Mật khẩu xác nhận không khớp',
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">Xác nhận mật khẩu</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="bg-white border-[#D4A574] text-black placeholder:text-black/50 focus-visible:border-[#C49564] focus-visible:ring-[#C49564]/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 w-4 h-4 border-[#D4A574] rounded focus:ring-[#C49564] text-[#C49564]"
                />
                <Label
                  htmlFor="terms"
                  className="text-sm text-black cursor-pointer"
                >
                  Tôi đồng ý với{' '}
                  <button
                    type="button"
                    className="text-[#C49564] hover:text-[#B48554] underline"
                  >
                    Điều khoản sử dụng
                  </button>{' '}
                  và{' '}
                  <button
                    type="button"
                    className="text-[#C49564] hover:text-[#B48554] underline"
                  >
                    Chính sách bảo mật
                  </button>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#D4A574] hover:bg-[#C49564] text-black font-medium"
                disabled={isLoading}
              >
                {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
              </Button>

              <div className="text-center text-sm text-black/70">
                Đã có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="text-[#C49564] hover:text-[#B48554] font-medium underline"
                >
                  Đăng nhập ngay
                </button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

