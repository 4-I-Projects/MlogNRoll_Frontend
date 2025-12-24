import { apiClient } from '@/lib/api-client';
import { User } from '@/features/auth/types';

// Định nghĩa Type khớp với Backend (openapi.yaml)
export interface CommentUser {
    id: string;
    username: string;
    avatarUrl: string | null;
}

export interface Comment {
    id: string;
    postId: number;
    parentId: string | null;
    content: string;
    user: CommentUser;
    likeCount: number;
    replyCount: number;
    isLiked: boolean;
    createdAt: string;
    updatedAt: string;
    // Frontend thêm trường này để chứa reply khi fetch
    replies?: Comment[]; 
}

export interface CommentListResponse {
    data: Comment[];
    meta: {
        nextCursor: string | null;
        limit: number;
    };
}

export interface CreateCommentDTO {
    postId: number;
    content: string;
    parentId?: string; // Optional
}

// 1. Get root comments
export const getComments = async (postId: string, cursor?: string): Promise<CommentListResponse> => {
    return apiClient.get(`/posts/${postId}/comments`, {
        params: { cursor, limit: 10 }
    });
};

// 2. Get replies of a comment
export const getReplies = async (commentId: string, cursor?: string): Promise<CommentListResponse> => {
    return apiClient.get(`/comments/${commentId}/replies`, {
        params: { cursor, limit: 5 }
    });
};

// 3. Create comment/reply
export const createComment = async (data: CreateCommentDTO): Promise<Comment> => {
    return apiClient.post('/comments', data);
};

// 4. Update comment
export const updateComment = async (commentId: string, content: string): Promise<Comment> => {
    return apiClient.put(`/comments/${commentId}`, { content });
};

// 5. Delete comment
export const deleteComment = async (commentId: string): Promise<void> => {
    return apiClient.delete(`/comments/${commentId}`);
};