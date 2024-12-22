import { StatusCodes } from "http-status-codes";

export class AppError<T> extends Error {
    statusCode: number;
    isOperational: boolean;
    errors?: T;

    constructor(
        message: string,
        statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
        isOperational: boolean = true,
        errors?: T
    ) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.errors = errors;

        Error.captureStackTrace(this, this.constructor);
    }
}
