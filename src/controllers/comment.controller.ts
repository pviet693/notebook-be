import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { CommentService } from "@/services";
import { ApiResponse } from "@/types/ApiResponse";
import { AppError } from "@/types/AppError";

class CommentController {
    public static async getParentComments(req: Request, res: Response, next: NextFunction) {
        try {
            const blogId = req.params.blogId;

            const responseData = await CommentService.getParentComments(blogId);
            const apiResponse: ApiResponse = {
                success: true,
                message: "Parent comments retrieved successfully",
                data: responseData
            };

            res.status(StatusCodes.OK).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }

    public static async getChildComments(req: Request, res: Response, next: NextFunction) {
        try {
            const parentCommentId = req.params.commentId;

            const responseData = await CommentService.getChildComments(parentCommentId as string);
            const apiResponse: ApiResponse = {
                success: true,
                message: "Child comments retrieved successfully",
                data: responseData
            };

            res.status(StatusCodes.OK).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }

    public static async countComments(req: Request, res: Response, next: NextFunction) {
        try {
            const blogId = req.params.blogId;

            const responseData = await CommentService.countComments(blogId as string);
            const apiResponse: ApiResponse = {
                success: true,
                message: "Comments count retrieved successfully",
                data: responseData
            };

            res.status(StatusCodes.OK).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }

    public static async addComment(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id;
            const ioInstance = req.app.get("io");

            if (userId !== req.body.userId) {
                throw new AppError("Unauthorized access", StatusCodes.UNAUTHORIZED, true);
            }

            const responseData = await CommentService.addComment(req.body, ioInstance);
            const apiResponse: ApiResponse = {
                success: true,
                message: "Comment added successfully",
                data: responseData
            };

            res.status(StatusCodes.OK).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }

    public static async editComment(req: Request, res: Response, next: NextFunction) {
        try {
            const ioInstance = req.app.get("io");

            const responseData = await CommentService.editComment(req.body, ioInstance);
            const apiResponse: ApiResponse = {
                success: true,
                message: "Comment updated successfully",
                data: responseData
            };

            res.status(StatusCodes.OK).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }

    public static async deleteComment(req: Request, res: Response, next: NextFunction) {
        try {
            const commentId = req.params.commentId;
            const ioInstance = req.app.get("io");

            const responseData = await CommentService.deleteComment(commentId as string, ioInstance);
            const apiResponse: ApiResponse = {
                success: true,
                message: "Likes count retrieved successfully",
                data: responseData
            };

            res.status(StatusCodes.OK).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }
}

export default CommentController;
