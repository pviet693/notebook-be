import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import { ApiResponse } from "@/types/ApiResponse";

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    const message = `Cannot find ${req.originalUrl} on this server`;
    const response: ApiResponse = {
        success: false,
        message,
        errors: {}
    };
    res.status(StatusCodes.NOT_FOUND).json(response);
};

export default notFoundHandler;
