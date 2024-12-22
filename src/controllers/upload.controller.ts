import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { UploadService } from "@/services";
import { ApiResponse } from "@/types/ApiResponse";

class UploadController {
    public static async upload(req: Request, res: Response, next: NextFunction) {
        try {
            const responseData = await UploadService.upload(req.file as Express.Multer.File);
            const apiResponse: ApiResponse = {
                success: true,
                message: "Upload File successfully",
                data: responseData
            };

            res.status(StatusCodes.OK).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }
}

export default UploadController;
