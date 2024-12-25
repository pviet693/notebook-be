import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { UserService } from "@/services";
import { ApiResponse } from "@/types/ApiResponse";
import { AppError } from "@/types/AppError";

class UserController {
    public static async signUp(req: Request, res: Response, next: NextFunction) {
        try {
            const responseData = await UserService.signUp(req.body);
            const apiResponse: ApiResponse = {
                success: true,
                message: "User signed in successfully",
                data: responseData
            };

            res.status(StatusCodes.OK).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }

    public static async signIn(req: Request, res: Response, next: NextFunction) {
        try {
            const responseData = await UserService.signIn(req.body);
            const apiResponse: ApiResponse = {
                success: true,
                message: "User signed in successfully",
                data: responseData
            };

            res.status(StatusCodes.OK).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }

    public static async googleSignUp(req: Request, res: Response, next: NextFunction) {
        try {
            const responseData = await UserService.googleSignUp(req.body);
            const apiResponse: ApiResponse = {
                success: true,
                message: "User signed in successfully",
                data: responseData
            };

            res.status(StatusCodes.OK).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }

    public static async googleSignIn(req: Request, res: Response, next: NextFunction) {
        try {
            const responseData = await UserService.googleSignIn(req.body);
            const apiResponse: ApiResponse = {
                success: true,
                message: "User signed in successfully",
                data: responseData
            };

            res.status(StatusCodes.OK).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }

    public static async changePassword(req: Request, res: Response, next: NextFunction) {
        try {
            await UserService.changePassword(req.body, req.user!.id);
            const apiResponse: ApiResponse = {
                success: true,
                message: "Password changed successfully"
            };

            res.status(StatusCodes.OK).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }

    public static async editProfile(req: Request, res: Response, next: NextFunction) {
        try {
            await UserService.editProfile(req.body, req.user!.id);
            const apiResponse: ApiResponse = {
                success: true,
                message: "Profile updated successfully"
            };

            res.status(StatusCodes.OK).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }

    public static async getMe(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.id;

            if (!userId || userId !== req.user!.id) {
                throw new AppError("Unauthorized access", StatusCodes.UNAUTHORIZED, true);
            }

            const responseData = await UserService.getMe(req.user!.id);
            const apiResponse: ApiResponse = {
                success: true,
                message: "User data retrieved successfully",
                data: responseData
            };

            res.status(StatusCodes.OK).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }

    public static async getTopAuthors(req: Request, res: Response, next: NextFunction) {
        try {
            const responseData = await UserService.getTopAuthors();
            const apiResponse: ApiResponse = {
                success: true,
                message: "Top authors retrieved successfully",
                data: responseData
            };

            res.status(StatusCodes.OK).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }

    public static async getAllAuthors(req: Request, res: Response, next: NextFunction) {
        try {
            const responseData = await UserService.getAllAuthors();
            const apiResponse: ApiResponse = {
                success: true,
                message: "All authors retrieved successfully",
                data: responseData
            };

            res.status(StatusCodes.OK).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }

    public static async getAuthorByUsername(req: Request, res: Response, next: NextFunction) {
        try {
            const username = req.params.username;
            const responseData = await UserService.getAuthorByUsername(username);

            const apiResponse: ApiResponse = {
                success: true,
                message: "Author retrieved successfully",
                data: responseData
            };

            res.status(StatusCodes.OK).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }
}

export default UserController;
