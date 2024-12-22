export type CommentAdd = {
    comment: string;
    userId: string;
    blogId: string;
    parentCommentId?: string;
};

export type CommentEdit = {
    id: string;
    comment: string;
};
