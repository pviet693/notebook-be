import { StatusCodes } from "http-status-codes";
import { Server } from "socket.io";

import Blog from "@/models/Blog";
import Notification from "@/models/Notification";
import User from "@/models/User";
import { AppError } from "@/types/AppError";
import { type NotificationCreate } from "@/types/NotificationCreate";
import { NotificationType } from "@/types/NotificationType";
import { type PaginationQuery } from "@/types/PaginationQuery";
import NotificationValidator from "@/validators/NotificationValidator";

class NotificationService {
    public static async getNotificationsPagination(query: PaginationQuery, userId: string) {
        const { page, limit } = query;
        const offset = (page - 1) * limit;

        const notifications = await Notification.findAndCountAll({
            where: { userId },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "email", "username", "profile_img", "fullname"]
                },
                {
                    model: User,
                    as: "sender",
                    attributes: ["id", "email", "username", "profile_img", "fullname"]
                },
                {
                    model: Blog,
                    as: "blog",
                    attributes: ["id", "title", "slug"]
                }
            ],
            limit, // Limit the number of notifications returned per page
            offset, // Skip records based on page
            order: [
                ["createdAt", "DESC"] // Sort by createdAt in descending order
            ],
            distinct: true
        });

        // Calculate the total number of pages
        const totalPages = Math.ceil(notifications.count / limit);

        return {
            page,
            limit,
            totalPages,
            total: notifications.count,
            data: notifications.rows
        };
    }

    public static async createNotification(payload: NotificationCreate, ioInstance: Server) {
        const validationResult = NotificationValidator.validateCreate(payload);

        if (!validationResult.success) {
            throw new AppError(
                "Invalid create notification data",
                StatusCodes.BAD_REQUEST,
                true,
                validationResult.error.errors
            );
        }

        const { senderId, userId, type, message, blogId, parentCommentId, replyCommentId } = payload;

        const sender = await User.findByPk(senderId);

        if (!sender) {
            throw new AppError("Sender does not exist", StatusCodes.NOT_FOUND, true);
        }

        const receiver = await User.findByPk(userId);

        if (!receiver) {
            throw new AppError("Receiver does not exist", StatusCodes.NOT_FOUND, true);
        }

        if (blogId) {
            const blog = await Blog.findByPk(blogId);

            if (!blog) {
                throw new AppError("Blog does not exist", StatusCodes.NOT_FOUND, true);
            }
        }

        if (payload.type === NotificationType.COMMENT) {
            const existingNotification = await Notification.findOne({
                where: {
                    senderId,
                    userId,
                    type: NotificationType.COMMENT,
                    blogId
                }
            });

            if (existingNotification) {
                return;
            }
        }

        const newNotification = await Notification.create({
            senderId,
            userId,
            type,
            message,
            blogId,
            parentCommentId,
            replyCommentId,
            hasRead: false
        });

        this.sendNotification(newNotification, ioInstance);

        return newNotification;
    }

    private static async sendNotification(payload: Notification, ioInstance: Server) {
        ioInstance.of("/notifications").to(payload.userId).emit("notification", payload);
    }

    public static async unreadCount(userId: string) {
        const unreadCount = await Notification.count({ where: { userId, hasRead: false } });
        return unreadCount;
    }

    public static async markAsRead(notificationId: string, userId: string) {
        const notification = await Notification.findOne({ where: { userId, hasRead: false, id: notificationId } });

        if (!notification) {
            throw new AppError("Notification not found", StatusCodes.NOT_FOUND, true);
        }

        notification.hasRead = true;
        await notification.save();

        return notification;
    }

    public static async markAllAsRead(userId: string) {
        await Notification.update({ hasRead: true }, { where: { userId } });

        return true;
    }
}

export default NotificationService;
