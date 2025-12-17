// src/utils/date.ts

export const formatDate = (dateString: string | undefined | null): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Kiểm tra date hợp lệ
  if (isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const formatRelativeTime = (dateString: string): string => {
  // Ví dụ: "2 hours ago" (Có thể cài thêm date-fns nếu cần phức tạp hơn)
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return formatDate(dateString);
};