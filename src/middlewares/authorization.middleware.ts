import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { TokenProvider } from "../providers/token/token.provider";
import { Role } from "@prisma/client";

const tokenProvider = new TokenProvider()

export function authorize(role: Role) {
    return(
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const token = req.headers.authorization!.split(' ')[1]

        const payload = tokenProvider.verify(token) as {id: string, role: string}

        if (role !== payload.role) {
            throw new AppError('No access permission', 403)
        }

        next()
    }
}