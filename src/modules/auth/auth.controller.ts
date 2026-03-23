import { Request, Response } from "express";
import { AuthService } from "./auth.servise";
import { authLogin } from "../users/schemas/users.schema";

export class AuthController {
    constructor (
        private authService: AuthService
    ) {}
    login = async (req: Request, res: Response) => {
        const data = authLogin.parse(req.body)

        const token = await this.authService.login(data)

        return res.status(200).json(token)
    }

    refreshToken = async (req: Request, res: Response) => {
        const { refreshToken } = req.body

        const result = await this.authService.refresh(refreshToken)

        return res.status(200).json(result)
    }
}