import { apiClient } from '@/lib/api-client';

// Interface trả về từ Backend
interface CommentResponse {
    id: string | number;
    postId: number;
    parentId: string | null;
    content: string;
    
    // Backend trả về object user lồng nhau (hoặc null)
    user?: {
        id: string;
        username: string;
        avatarUrl: string | null;
        displayName?: string;
    };
    
    // Fallback ID
    userId?: string;
    
    likeCount: number;
    replyCount: number;
    isLiked: boolean;
    createdAt: string;
    updatedAt: string;
    replies?: CommentResponse[];
}

export interface Comment {
    id: string;
    postId: number;
    parentId: string | null;
    content: string;
    userId: string;
    fallbackUser: {
        username: string;
        displayName: string;
        avatarUrl: string | null;
    };
    likeCount: number;
    replyCount: number;
    isLiked: boolean;
    createdAt: string;
    updatedAt: string;
    replies: Comment[]; 
}

export interface CommentListResponse {
    data: Comment[];
    meta: any;
}

export interface CreateCommentDTO {
    postId: number;
    content: string;
    parentId?: string;
}

// --- HÀM MAP DỮ LIỆU ---
const mapCommentResponse = (data: CommentResponse): Comment => {
    // [FIX] Sửa lỗi TypeScript: Dùng optional chaining (?.) thay vì || {}
    // data.user?.id sẽ trả về undefined nếu data.user không tồn tại, code sẽ chạy tiếp sang ||
    const userId = data.user?.id || data.userId || '';

    return {
        id: String(data.id),
        postId: Number(data.postId),
        parentId: data.parentId || null,
        content: data.content,
        
        // userId chuẩn để hook useUser gọi lại
        userId: String(userId),
        
        // [FIX] Sửa lỗi truy cập property trên object rỗng
        fallbackUser: {
            username: data.user?.username || 'unknown',
            displayName: data.user?.displayName || data.user?.username || 'Unknown',
            avatarUrl: data.user?.avatarUrl || null,
        },
        
        likeCount: data.likeCount || 0,
        replyCount: data.replyCount || 0,
        isLiked: data.isLiked || false,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
        replies: data.replies?.map(mapCommentResponse) || []
    };
};

export const getComments = async (postId: string, cursor?: string): Promise<CommentListResponse> => {
    const response = await apiClient.get(`/posts/${postId}/comments`, {
        params: { cursor, limit: 10 }
    }) as any;
    const rawData = response.data || (Array.isArray(response) ? response : []);
    return {
        data: Array.isArray(rawData) ? rawData.map(mapCommentResponse) : [],
        meta: response.meta || {}
    };
};

export const getReplies = async (commentId: string, cursor?: string): Promise<CommentListResponse> => {
    const response = await apiClient.get(`/comments/${commentId}/replies`, {
        params: { cursor, limit: 5 }
    }) as any;
    const rawData = response.data || (Array.isArray(response) ? response : []);
    return {
        data: Array.isArray(rawData) ? rawData.map(mapCommentResponse) : [],
        meta: response.meta || {}
    };
};

export const createComment = async (data: CreateCommentDTO): Promise<Comment> => {
    const response = await apiClient.post('/comments', data) as any;
    return mapCommentResponse(response);
};