import { apiClient } from '@/lib/api-client';
import { User } from '../types';

// DTO cho việc tạo user (Body của POST)
export type CreateUserDTO = {
  username: string;
};

// DTO cho việc update user (Body của PATCH)
// Lưu ý: Backend trả về snake_case (avatar_url, display_name) nên gửi lên cũng nên theo format đó
export type UpdateUserDTO = {
  username?: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
};

// POST /api/v1/users
export const createUserProfile = async (data: CreateUserDTO): Promise<User> => {
  return apiClient.post('/users', data);
};

// PATCH /api/v1/users/me
export const updateUserProfile = async (data: UpdateUserDTO): Promise<User> => {
  return apiClient.patch('/users/me', data);
};