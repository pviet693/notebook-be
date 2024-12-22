export type NotificationCreate = {
    senderId: string;
    userId: string;
    type: string;
    message: string;
    blogId?: string;
    parentCommentId?: string;
    replyCommentId?: string;
};
