import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

import { envConfig } from "@/configs/env.config";
import { AccessTokenPayload } from "@/types/AccessTokenPayload";
import { AppError } from "@/types/AppError";

// Middleware to check JWT token in the request header
const authHandler = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"

    if (!token) {
        return next(new AppError("Authorization token missing", StatusCodes.UNAUTHORIZED, true));
    }

    try {
        const decoded = jwt.verify(token, envConfig!.JWT_SECRET_KEY) as AccessTokenPayload;

        req.user = { ...decoded };

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        return next(new AppError("Invalid or expired token", StatusCodes.UNAUTHORIZED, true, error));
    }
};

export default authHandler;
