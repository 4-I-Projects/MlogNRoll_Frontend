// src/config/constants.ts

export const POST_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  SCHEDULED: 'scheduled',
  UNLISTED: 'unlisted',
} as const;

export const VISIBILITY = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  FOLLOWERS: 'followers',
} as const;