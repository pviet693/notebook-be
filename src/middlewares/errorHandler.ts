import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { ApiResponse } from "@/types/ApiResponse";
import { AppError } from "@/types/AppError";

const errorHandler = (err: AppError<unknown>, req: Request, res: Response, next: NextFunction) => {
    const statusCode = (err instanceof AppError && err.statusCode) || StatusCodes.INTERNAL_SERVER_ERROR;
    const message = err.message || "Internal Server Error";
    const response: ApiResponse = {
        success: false,
        message,
        errors: err instanceof AppError && err.errors ? err.errors : []
    };

    res.status(statusCode).json(response);
};

export default errorHandler;
