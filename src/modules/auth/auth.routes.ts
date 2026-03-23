import { Router } from "express";
import { HashProvider } from "../../providers/hash/hash.provider";
import { TokenProvider } from "../../providers/token/token.provider";
import { AuthService } from "./auth.servise";
import { AuthController } from "./auth.controller";
import { AuthRepository } from "./auth.repository";
import { UserRepository } from "../users/repositories/user.repository";

const authRoutes = Router()

const authRepository = new AuthRepository()
const userRepository = new UserRepository()
const hashProvider = new HashProvider()
const tokenProvider = new TokenProvider()
const authService = new AuthService(authRepository, userRepository, hashProvider, tokenProvider)
const authController = new AuthController(authService)

authRoutes.post('/login', authController.login)
authRoutes.post('/refresh-token', authController.refreshToken)

export { authRoutes }