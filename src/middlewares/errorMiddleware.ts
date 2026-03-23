import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { ZodError } from "zod";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

export function errorMiddleware(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.log(error)

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            error: error.message
        })
    }

    if (error instanceof ZodError) {
        return res.status(400).json({
            error: "Validation failed",
            details: error.issues
        })
    }

    if (error instanceof JsonWebTokenError) {
        return res.status(401).json({
            error: "Invalid token"
        })
    }

    if (error instanceof TokenExpiredError) {
        return res.status(401).json({
            error: 'Token expired'
        })
    }

    return res.status(500).json({
        error: "Internal server error"
    })
}