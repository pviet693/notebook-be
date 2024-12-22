import { StatusCodes } from "http-status-codes";
import { Server } from "socket.io";

import Blog from "@/models/Blog";
import Like from "@/models/Like";
import NotificationService from "@/services/notification.service";
import { AppError } from "@/types/AppError";
import { NotificationType } from "@/types/NotificationType";

class LikeService {
    public static async likeBlog(userId: string, blogId: string, ioInstance: Server) {
        const blog = await Blog.findByPk(blogId);

        if (!blog) {
            throw new AppError("Blog not found", StatusCodes.NOT_FOUND, true);
        }

        const existingLike = await Like.findOne({
            where: {
                userId,
                blogId
            }
        });

        if (existingLike) {
            existingLike.isLiked = !existingLike.isLiked;
            await existingLike.save();
            return existingLike;
        }

        const newLike = await Like.create({
            userId,
            blogId,
            isLiked: true
        });

        // Notify the blog owner that a new like has been added
        if (blog!.userId !== userId) {
            NotificationService.createNotification(
                {
                    senderId: userId,
                    userId: blog!.userId as string,
                    type: NotificationType.LIKE,
                    message: "Liked your blog",
                    blogId
                },
                ioInstance
            );
        }

        return newLike;
    }

    public static async hasLikedBlog(userId: string, blogId: string) {
        const blog = await Blog.findByPk(blogId);

        if (!blog) {
            throw new AppError("Blog not found", StatusCodes.NOT_FOUND, true);
        }

        const like = await Like.findOne({
            where: {
                userId,
                blogId
            }
        });

        return like ? like.isLiked : false;
    }

    public static async countLikes(blogId: string) {
        const blog = await Blog.findByPk(blogId);

        if (!blog) {
            throw new AppError("Blog not found", StatusCodes.NOT_FOUND, true);
        }

        const count = await Like.count({
            where: {
                blogId,
                isLiked: true
            }
        });

        return count;
    }
}

export default LikeService;
