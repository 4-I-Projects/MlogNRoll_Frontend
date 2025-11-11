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

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginProps {
  onNavigate: (page: string) => void;
  onLoginSuccess?: () => void;
}

export function Login({ onNavigate, onLoginSuccess }: LoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Login data:', data);
      // Call success callback if provided
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        // Default: navigate to home
        onNavigate('home');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-[#D4A574] shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-black text-center">
            Đăng nhập
          </CardTitle>
          <CardDescription className="text-center text-black/70">
            Nhập thông tin để đăng nhập vào tài khoản của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                render={({ field }: { field: any }) => (
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
                render={({ field }: { field: any }) => (
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

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 border-[#D4A574] rounded focus:ring-[#C49564] text-[#C49564]"
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm text-black cursor-pointer"
                  >
                    Ghi nhớ đăng nhập
                  </Label>
                </div>
                <button
                  type="button"
                  className="text-sm text-[#C49564] hover:text-[#B48554] underline"
                >
                  Quên mật khẩu?
                </button>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#D4A574] hover:bg-[#C49564] text-black font-medium"
                disabled={isLoading}
              >
                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>

              <div className="text-center text-sm text-black/70">
                Chưa có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('register')}
                  className="text-[#C49564] hover:text-[#B48554] font-medium underline"
                >
                  Đăng ký ngay
                </button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

