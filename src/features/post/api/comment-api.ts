import { apiClient } from '@/lib/api-client';

// --- 1. ĐỊNH NGHĨA KIỂU DỮ LIỆU TỪ BACKEND (RAW) ---
interface CommentUserResponse {
    id: string;
    username: string;
    display_name?: string;
    avatar_url?: string;
}

interface CommentResponse {
    id: string | number;
    postId: number;
    post_id?: number;
    parentId: string | null;
    parent_id?: string | null;
    content: string;
    user: CommentUserResponse;
    likeCount: number;
    like_count?: number;
    replyCount: number;
    reply_count?: number;
    isLiked: boolean;
    is_liked?: boolean;
    createdAt: string;
    created_at?: string;
    updatedAt: string;
    updated_at?: string;
    replies?: CommentResponse[];
}

// --- 2. ĐỊNH NGHĨA KIỂU DỮ LIỆU FRONTEND SỬ DỤNG ---
export interface CommentUser {
    id: string;
    username: string;
    displayName: string;
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

// --- 3. HÀM MAP DỮ LIỆU ---
const mapCommentResponse = (data: CommentResponse): Comment => {
    const rawUser = data.user || {};
    const user: CommentUser = {
        id: rawUser.id,
        username: rawUser.username || 'unknown',
        displayName: rawUser.display_name || rawUser.username || 'Unknown',
        avatarUrl: rawUser.avatar_url || null, 
    };

    return {
        id: String(data.id),
        postId: Number(data.postId || data.post_id),
        parentId: data.parentId || data.parent_id || null,
        content: data.content,
        user: user,
        likeCount: data.likeCount || data.like_count || 0,
        replyCount: data.replyCount || data.reply_count || 0,
        isLiked: data.isLiked || data.is_liked || false,
        createdAt: data.createdAt || data.created_at || new Date().toISOString(),
        updatedAt: data.updatedAt || data.updated_at || new Date().toISOString(),
        replies: data.replies?.map(mapCommentResponse) || []
    };
};

// --- 4. CÁC HÀM GỌI API ---

// 1. Get root comments
export const getComments = async (postId: string, cursor?: string): Promise<CommentListResponse> => {
    // [FIX] Thêm 'as any' để TypeScript biết đây là dữ liệu thô đã qua interceptor
    const response = await apiClient.get(`/posts/${postId}/comments`, {
        params: { cursor, limit: 10 }
    }) as any;

    const rawData = response.data || (Array.isArray(response) ? response : []);
    const meta = response.meta || { nextCursor: null, limit: 10 };

    return {
        data: Array.isArray(rawData) ? rawData.map(mapCommentResponse) : [],
        meta
    };
};

// 2. Get replies of a comment
export const getReplies = async (commentId: string, cursor?: string): Promise<CommentListResponse> => {
    // [FIX] Thêm 'as any'
    const response = await apiClient.get(`/comments/${commentId}/replies`, {
        params: { cursor, limit: 5 }
    }) as any;

    const rawData = response.data || (Array.isArray(response) ? response : []);
    const meta = response.meta || { nextCursor: null, limit: 5 };

    return {
        data: Array.isArray(rawData) ? rawData.map(mapCommentResponse) : [],
        meta
    };
};

// 3. Create comment/reply
export const createComment = async (data: CreateCommentDTO): Promise<Comment> => {
    // [FIX] Thêm 'as any' hoặc cast đúng kiểu Response
    const response = await apiClient.post('/comments', data) as any;
    return mapCommentResponse(response);
};

// 4. Update comment
export const updateComment = async (commentId: string, content: string): Promise<Comment> => {
    const response = await apiClient.put(`/comments/${commentId}`, { content }) as any;
    return mapCommentResponse(response);
};

// 5. Delete comment
export const deleteComment = async (commentId: string): Promise<void> => {
    return apiClient.delete(`/comments/${commentId}`);
};