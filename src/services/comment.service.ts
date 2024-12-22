import { StatusCodes } from "http-status-codes";
import { Sequelize } from "sequelize";
import { Server } from "socket.io";

import Blog from "@/models/Blog";
import Comment from "@/models/Comment";
import User from "@/models/User";
import NotificationService from "@/services/notification.service";
import { AppError } from "@/types/AppError";
import { CommentEdit, type CommentAdd } from "@/types/Comment";
import { NotificationType } from "@/types/NotificationType";

class CommentService {
    public static async getParentComments(blogId: string) {
        const comments = await Comment.findAll({
            where: { blogId, parentCommentId: null },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "email", "username", "profile_img", "fullname"]
                },
                {
                    model: Comment,
                    as: "replies",
                    attributes: []
                }
            ],
            attributes: {
                include: [[Sequelize.cast(Sequelize.fn("COUNT", Sequelize.col("replies.id")), "INTEGER"), "replyCount"]]
            },
            group: ["Comment.id", "user.id", "user.email", "user.username", "user.profile_img", "user.fullname"],
            order: [["createdAt", "ASC"]]
        });

        return comments;
    }

    public static async getChildComments(parentCommentId: string) {
        const comments = await Comment.findAll({
            where: { parentCommentId },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "email", "username", "profile_img", "fullname"]
                },
                {
                    model: Comment,
                    as: "replies",
                    attributes: []
                }
            ],
            attributes: {
                include: [[Sequelize.cast(Sequelize.fn("COUNT", Sequelize.col("replies.id")), "INTEGER"), "replyCount"]]
            },
            group: ["Comment.id", "user.id", "user.email", "user.username", "user.profile_img", "user.fullname"],
            order: [["createdAt", "ASC"]]
        });

        return comments;
    }

    public static async countComments(blogId: string) {
        const commentsCount = await Comment.count({ where: { blogId } });

        return commentsCount;
    }

    public static async addComment(payload: CommentAdd, ioInstance: Server) {
        const blog = await Blog.findByPk(payload.blogId);

        if (!blog) {
            throw new AppError("Blog not found", StatusCodes.NOT_FOUND, true);
        }

        const { userId, comment, parentCommentId, blogId } = payload;

        const newComment = await Comment.create({
            comment,
            userId,
            blogId,
            parentCommentId
        });

        // Notify the blog owner that a new comment has been added
        if (blog!.userId !== userId) {
            NotificationService.createNotification(
                {
                    senderId: userId,
                    userId: blog!.userId as string,
                    type: NotificationType.COMMENT,
                    message: "Commented on your blog",
                    blogId
                },
                ioInstance
            );
        }

        // Notify the commenter that a reply has been added
        if (parentCommentId) {
            Comment.findByPk(parentCommentId).then((parentComment) => {
                if (parentComment && userId !== parentComment!.userId) {
                    NotificationService.createNotification(
                        {
                            senderId: userId,
                            userId: parentComment!.userId as string,
                            type: NotificationType.REPLY,
                            message: "Replied to your comment",
                            parentCommentId: parentComment!.id,
                            replyCommentId: newComment.id,
                            blogId
                        },
                        ioInstance
                    );
                }
            });
        }

        this.asyncComment(ioInstance, blogId, parentCommentId);

        return newComment;
    }

    public static async editComment(payload: CommentEdit, ioInstance: Server) {
        const { id, comment } = payload;

        const commentToUpdate = await Comment.findByPk(id);

        if (!commentToUpdate) {
            throw new AppError("Comment not found", StatusCodes.NOT_FOUND, true);
        }

        commentToUpdate.comment = comment;
        await commentToUpdate.save();

        this.asyncComment(ioInstance, commentToUpdate.blogId, commentToUpdate!.parentCommentId);

        return commentToUpdate;
    }

    public static async deleteComment(commentId: string, ioInstance: Server) {
        const commentToDelete = await Comment.findByPk(commentId);

        if (!commentToDelete) {
            throw new AppError("Comment not found", StatusCodes.NOT_FOUND, true);
        }

        await commentToDelete.destroy();

        this.asyncComment(ioInstance, commentToDelete.blogId, commentToDelete!.parentCommentId);

        return commentToDelete;
    }

    private static asyncComment(ioInstance: Server, blogId: string, parentCommentId?: string | null) {
        ioInstance.of("/comments").to(blogId).emit("comment", {
            blogId,
            parentCommentId
        });
    }
}

export default CommentService;
