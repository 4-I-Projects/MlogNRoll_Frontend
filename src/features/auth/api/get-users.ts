import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { User } from '../types';
import { mapUserFromBE } from './get-user'; // Tận dụng lại hàm map ở file trên

export const getUsers = async (): Promise<User[]> => {
  // Giả sử API trả về mảng user
  const response = await apiClient.get<any[]>('/users');
  
  // Kiểm tra nếu response là mảng thì map từng phần tử
  if (Array.isArray(response)) {
    return response.map(mapUserFromBE);
  }
  
  // Trường hợp response bọc trong object { data: [...] }
  if ((response as any).data && Array.isArray((response as any).data)) {
    return (response as any).data.map(mapUserFromBE);
  }

  return [];
};

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });
};