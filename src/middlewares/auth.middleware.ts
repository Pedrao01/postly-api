import { Request, Response, NextFunction } from "express"
import { AppError } from "../errors/AppError"
import { TokenProvider } from "../providers/token/token.provider"

const tokenProvider = new TokenProvider()

export function auth(
    req: Request,
    res: Response,
    next: NextFunction
){
    const authHeader = req.headers.authorization


    if (!authHeader) {
        throw new AppError('Token not provided', 401)
    }

    const token = authHeader.split(' ')[1]


    tokenProvider.verify(token)

    next()
}