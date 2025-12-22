import { apiClient } from '@/lib/api-client';

interface UploadResponse {
  url: string;
}

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await apiClient.post('/media/upload', formData, { 
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }) as unknown as UploadResponse;

  return res.url;
};