export interface User {
  id: string;
  username: string;
  displayName: string;
  bio?: string;

  avatarUrl?: string;
  banned?: boolean;

  createdAt?: string;
  updatedAt?: string;
  



  name: string;
  avatar: string;
  followingCount: number;
  followersCount: number;
  isFollowing?: boolean;
}