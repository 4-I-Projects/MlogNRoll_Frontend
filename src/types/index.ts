export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  message: string;
  read: boolean;
  date: string;
  userId: string;
  postId?: string;
}
