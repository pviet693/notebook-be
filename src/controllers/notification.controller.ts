import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { NotificationService } from "@/services";
import { ApiResponse } from "@/types/ApiResponse";

class BlogController {
    public static async getNotificationsPagination(req: Request, res: Response, next: NextFunction) {
        try {
            const page = Number(req.query.page as string) || 1;
            const limit = Number(req.query.limit as string) || 10;
            const userId = req.user!.id;
            const responseData = await NotificationService.getNotificationsPagination({ page, limit }, userId);
            const apiResponse: ApiResponse = {
                success: true,
                message: "Blogs retrieved successfully",
                data: responseData
            };

            res.status(StatusCodes.OK).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }

    public static async unreadCount(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id;
            const responseData = await NotificationService.unreadCount(userId);
            const apiResponse: ApiResponse = {
                success: true,
                message: "Unread notification count retrieved successfully",
                data: responseData
            };

            res.status(StatusCodes.OK).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }

    public static async markAsRead(req: Request, res: Response, next: NextFunction) {
        try {
            const notificationId = req.body.notificationId;
            const userId = req.user!.id;
            const responseData = await NotificationService.markAsRead(notificationId, userId);
            const apiResponse: ApiResponse = {
                success: true,
                message: "Notification marked as read successfully",
                data: responseData
            };

            res.status(StatusCodes.OK).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }

    public static async markAllAsRead(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id;
            await NotificationService.markAllAsRead(userId);
            const apiResponse: ApiResponse = {
                success: true,
                message: "All notifications marked as read successfully"
            };

            res.status(StatusCodes.OK).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }
}

export default BlogController;
