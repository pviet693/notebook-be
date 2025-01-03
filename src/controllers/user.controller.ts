import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { UserService } from "@/services";
import { ApiResponse } from "@/types/ApiResponse";

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

    public static async requestOTP(req: Request, res: Response, next: NextFunction) {
        try {
            await UserService.requestOTP(req.body.email);
            const apiResponse: ApiResponse = {
                success: true,
                message: "OTP sent successfully. Please check your email."
            };

            res.status(StatusCodes.OK).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }

    public static async verifyOTP(req: Request, res: Response, next: NextFunction) {
        try {
            await UserService.verifyOTP(req.body.email, req.body.otp);
            const apiResponse: ApiResponse = {
                success: true,
                message: "OTP verified successfully"
            };

            res.status(StatusCodes.OK).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }

    public static async forgotPassword(req: Request, res: Response, next: NextFunction) {
        try {
            await UserService.resetPassword(req.body);
            const apiResponse: ApiResponse = {
                success: true,
                message: "Password reset successfully. Please sign in again."
            };

            res.status(StatusCodes.OK).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }
}

export default UserController;
