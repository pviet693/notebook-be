import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { BlogService } from "@/services";
import { ApiResponse } from "@/types/ApiResponse";
import { AppError } from "@/types/AppError";

class BlogController {
    public static async getBlogsPagination(req: Request, res: Response, next: NextFunction) {
        try {
            const page = Number(req.query.page as string) || 1;
            const limit = Number(req.query.limit as string) || 10;
            const categories = (req.query.categories ?? []) as string[];
            const authors = (req.query.authors ?? []) as string[];
            const title = (req.query.title ?? "") as string;
            const excludeBlogSlug = req.query.excludeBlogSlug as string;
            const responseData = await BlogService.getBlogsPagination({
                page,
                limit,
                categories,
                authors,
                title,
                excludeBlogSlug
            });
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

    public static async getDashboardBlogs(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id;
            const page = Number(req.query.page as string) || 1;
            const limit = Number(req.query.limit as string) || 10;
            const categories = (req.query.categories ?? []) as string[];
            const statuses = (req.query.statuses ?? []) as string[];
            const title = (req.query.title ?? "") as string;

            const responseData = await BlogService.getDashboardBlogs(
                { page, limit, statuses, categories, title },
                userId
            );
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

    public static async getBlogsByUsername(req: Request, res: Response, next: NextFunction) {
        try {
            const page = Number(req.query.page as string) || 1;
            const limit = Number(req.query.limit as string) || 10;
            const username = req.query.username! as string;

            if (!username) {
                throw new AppError("Username is required", StatusCodes.BAD_REQUEST);
            }
            const responseData = await BlogService.getBlogsByUsername({ page, limit, username });
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

    public static async createBlog(req: Request, res: Response, next: NextFunction) {
        try {
            const responseData = await BlogService.createBlog(req.body);
            const apiResponse: ApiResponse = {
                success: true,
                message: "Blog created successfully",
                data: responseData
            };

            res.status(StatusCodes.OK).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }

    public static async editBlog(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id;

            if (userId !== req.body.userId) {
                throw new AppError("Unauthorized to edit blog", StatusCodes.UNAUTHORIZED, true);
            }

            const responseData = await BlogService.editBlog(req.body);
            const apiResponse: ApiResponse = {
                success: true,
                message: "Blog updated successfully",
                data: responseData
            };

            res.status(StatusCodes.OK).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }

    public static async getBlogDetails(req: Request, res: Response, next: NextFunction) {
        try {
            const blogSlug = req.params.slug;

            if (!blogSlug) {
                throw new AppError("Blog slug is required", StatusCodes.BAD_REQUEST);
            }
            const responseData = await BlogService.getBlogDetails(blogSlug);
            const apiResponse: ApiResponse = {
                success: true,
                message: "Blog details retrieved successfully",
                data: responseData
            };

            res.status(StatusCodes.OK).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }

    public static async getBlogDetailsById(req: Request, res: Response, next: NextFunction) {
        try {
            const blogId = req.params.id;

            if (!blogId) {
                throw new AppError("Blog ID is required", StatusCodes.BAD_REQUEST);
            }
            const responseData = await BlogService.getBlogDetailsById(blogId);
            const apiResponse: ApiResponse = {
                success: true,
                message: "Blog details retrieved successfully",
                data: responseData
            };

            res.status(StatusCodes.OK).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }
}

export default BlogController;
