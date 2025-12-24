import { apiClient } from '@/lib/api-client';

export interface Tag {
  id: number;
  name: string;
  slug?: string;
  description?: string;
}

export type CreateTagDTO = {
  name: string;
  description?: string;
};

// GET /api/v1/tags
export const getTags = async (): Promise<Tag[]> => {
  return apiClient.get('/tags');
};

// POST /api/v1/tags
export const createTag = async (data: CreateTagDTO): Promise<Tag> => {
  return apiClient.post('/tags', data);
};