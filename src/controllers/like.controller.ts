import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { LikeService } from "@/services";
import { ApiResponse } from "@/types/ApiResponse";

class LikeController {
    public static async likeBlog(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id;
            const { blogId } = req.body;
            const ioInstance = req.app.get("io");

            const responseData = await LikeService.likeBlog(userId, blogId, ioInstance);
            const apiResponse: ApiResponse = {
                success: true,
                message: "Liked blog successfully",
                data: responseData
            };

            res.status(StatusCodes.OK).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }

    public static async hasLikedBlog(req: Request, res: Response, next: NextFunction) {
        try {
            const blogId = req.query.blogId;
            const userId = req.user!.id;

            const responseData = await LikeService.hasLikedBlog(userId, blogId as string);
            const apiResponse: ApiResponse = {
                success: true,
                message: "Blog liked status retrieved successfully",
                data: responseData
            };

            res.status(StatusCodes.OK).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }

    public static async countLikes(req: Request, res: Response, next: NextFunction) {
        try {
            const blogId = req.query.blogId;

            const responseData = await LikeService.countLikes(blogId as string);
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

export default LikeController;
