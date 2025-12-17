import { apiClient } from '@/lib/api-client';

interface UploadResponse {
  url: string;
}

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  // [SỬA LỖI] Ép kiểu kết quả trả về thành UploadResponse
  // Lý do: Interceptor của bạn đã return response.data, nhưng TS vẫn nghĩ nó là AxiosResponse
  const res = await apiClient.post('/content/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }) as unknown as UploadResponse;

  return res.url;
};