import { AppError } from "../../errors/AppError";
import { HashProvider } from "../../providers/hash/hash.provider";
import { TokenProvider } from "../../providers/token/token.provider";
import { UserRepository } from "../users/repositories/user.repository";
import { AuthRepository } from "./auth.repository";

interface LoginAuthService {
    email: string
    password: string
}

export class AuthService {
    constructor(
        private authRepository: AuthRepository,
        private userRepository: UserRepository,
        private hashProvider: HashProvider,
        private tokenProvider: TokenProvider
    ) {}
    async login({ email, password }: LoginAuthService) {
        const user = await this.userRepository.findByEmail(email)

        if (!user) {
            throw new AppError('Invalid Email', 400)
        }

        const passwordCompare = await this.hashProvider.compare(password, user.password)

        if(!passwordCompare) {
            throw new AppError('Incorret password', 401)
        }

        const refreshToken = this.tokenProvider.generateRefreshToken()
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        const token = this.tokenProvider.generate({id: user.id, role: user.role})

        await this.authRepository.createRefreshToken({
            token:refreshToken,
            userId: user.id,
            expiresAt
        })

        return { token, refreshToken }        

    }

    async refresh(refreshToken: string) {
        const token = await this.authRepository.findRefreshToken(refreshToken)
        

        if (!token) {
            throw new AppError('Invalid refresh token', 401)
        }


        if (token.expiresAt < new Date()) {
            throw new AppError('Refresh token expired', 401)
        }
        
        const user = await this.userRepository.findById(token.userId)

        if (!user) {
            throw new AppError('User not found', 404)
        }

        const accessToken = this.tokenProvider.generate({id: token.userId, role: user.role})

        await this.authRepository.deleteRefresh(token.id)

        const newRefreshToken = this.tokenProvider.generateRefreshToken()

        await this.authRepository.createRefreshToken({
            token: newRefreshToken,
            userId: user.id,
            expiresAt: new Date( Date.now() + 7 * 24 * 60 * 60 * 1000)
        })

        return { accessToken, newRefreshToken }
    }
}