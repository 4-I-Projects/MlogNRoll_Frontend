export interface User {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  followingCount: number;
  followersCount: number;
  isFollowing?: boolean;
}