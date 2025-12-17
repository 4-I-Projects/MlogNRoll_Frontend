import { Comment } from '@/features/post/types';

// Hàm này nhận vào list phẳng từ API và trả về list lồng nhau để render
export const buildCommentTree = (flatComments: Comment[]): Comment[] => {
  const commentMap: Record<string, Comment> = {};
  const roots: Comment[] = [];

  // 1. Tạo Map để tra cứu nhanh
  flatComments.forEach((c) => {
    // Đảm bảo replies luôn là mảng rỗng ban đầu
    commentMap[c.id] = { ...c, replies: [] };
  });

  // 2. Xếp comment vào đúng chỗ
  flatComments.forEach((c) => {
    const comment = commentMap[c.id];
    const parentId = c.parentId;

    if (parentId && commentMap[parentId]) {
      // Nếu có cha, đẩy nó vào mảng replies của cha
      commentMap[parentId].replies!.push(comment);
    } else {
      // Nếu không có cha (hoặc cha không tìm thấy), nó là root
      roots.push(comment);
    }
  });

  // 3. Sắp xếp (Mới nhất lên đầu)
  return roots.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};