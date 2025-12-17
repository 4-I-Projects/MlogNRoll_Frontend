export interface User {
  id: string;
  username: string;
  email: string;
  
  // [ĐỔI] Thêm 2 trường này giống Backend
  firstName: string;
  lastName: string;

  // [GIỮ] Vẫn giữ displayName để UI dùng cho tiện, nhưng sẽ là field được tính toán (computed)
  displayName: string;

  // [SỬA] Cho phép null/undefined để tạm bỏ qua
  bio?: string;
  avatar?: string;

  // [SỬA] Đánh dấu optional vì API User info cơ bản chưa trả về cái này
  followingCount?: number;
  followersCount?: number;
}