import { apiClient } from '@/lib/api-client';

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    // Gọi API upload, ép kiểu về any để tự xử lý logic kiểm tra
    const res = await apiClient.post('/posts/upload-image', formData, { 
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }) as any;

    let imageUrl = '';

    // LOGIC FIX: Kiểm tra kiểu dữ liệu trả về
    if (typeof res === 'string') {
        // Trường hợp 1: Backend trả về trực tiếp chuỗi URL
        imageUrl = res;
    } else if (res && typeof res === 'object' && res.url) {
        // Trường hợp 2: Backend trả về JSON { url: "..." }
        imageUrl = res.url;
    }

    // Làm sạch URL (xóa khoảng trắng thừa)
    imageUrl = imageUrl.trim();

    // Validate cuối cùng
    if (!imageUrl) {
        console.error("Debug Response:", res); // Log ra để kiểm tra nếu vẫn lỗi
        throw new Error("Server trả về URL rỗng hoặc định dạng không khớp");
    }

    return imageUrl;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};