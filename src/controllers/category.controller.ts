import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { CategoryService } from "@/services";
import { ApiResponse } from "@/types/ApiResponse";

class CategoryController {
    public static async getAllCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const responseData = await CategoryService.getAllCategories();
            const apiResponse: ApiResponse = {
                success: true,
                message: "Categories retrieved successfully",
                data: responseData
            };

            res.status(StatusCodes.OK).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }

    public static async getTopCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const limit = Number(req.query.limit) || 5;
            const responseData = await CategoryService.getTopCategories(limit);
            const apiResponse: ApiResponse = {
                success: true,
                message: "Top categories retrieved successfully",
                data: responseData
            };

            res.status(StatusCodes.OK).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }

    public static async createCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const responseData = await CategoryService.createCategory(req.body);
            const apiResponse: ApiResponse = {
                success: true,
                message: "Category created successfully",
                data: responseData
            };

            res.status(StatusCodes.OK).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }
}

export default CategoryController;
