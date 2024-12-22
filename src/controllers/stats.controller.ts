import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { StatsService } from "@/services";
import { ApiResponse } from "@/types/ApiResponse";

class StatsController {
    public static async webVisitStats(req: Request, res: Response, next: NextFunction) {
        try {
            const responseData = await StatsService.webVisitStats();
            const apiResponse: ApiResponse = {
                success: true,
                message: "Web visit statistics retrieved successfully",
                data: responseData
            };
            res.status(StatusCodes.OK).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }

    public static async incrWebVisit(req: Request, res: Response, next: NextFunction) {
        try {
            await StatsService.incrWebVisit();
            const apiResponse: ApiResponse = {
                success: true,
                message: "Web visit incremented successfully"
            };
            res.status(StatusCodes.OK).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }

    public static async blogReadStats(req: Request, res: Response, next: NextFunction) {
        try {
            const responseData = await StatsService.blogReadStats();
            const apiResponse: ApiResponse = {
                success: true,
                message: "Blog read statistics retrieved successfully",
                data: responseData
            };
            res.status(StatusCodes.OK).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }

    public static async incrBlogRead(req: Request, res: Response, next: NextFunction) {
        try {
            const { blogId } = req.body;
            await StatsService.incrBlogRead(blogId);
            const apiResponse: ApiResponse = {
                success: true,
                message: "Blog read incremented successfully"
            };
            res.status(StatusCodes.OK).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }

    public static async newUserStats(req: Request, res: Response, next: NextFunction) {
        try {
            const responseData = await StatsService.newUserStats();
            const apiResponse: ApiResponse = {
                success: true,
                message: "New user statistics retrieved successfully",
                data: responseData
            };
            res.status(StatusCodes.OK).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }

    public static async newBlogStats(req: Request, res: Response, next: NextFunction) {
        try {
            const responseData = await StatsService.newBlogStats();
            const apiResponse: ApiResponse = {
                success: true,
                message: "New blog statistics retrieved successfully",
                data: responseData
            };
            res.status(StatusCodes.OK).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }
}

export default StatsController;
