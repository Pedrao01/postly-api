import { prisma } from "../../database/prismaClient"

interface CreateRefreshTokenRequest{
    token: string
    userId: string
    expiresAt: Date
}

export class AuthRepository {
    async createRefreshToken({token, userId, expiresAt}: CreateRefreshTokenRequest) {
        await prisma.refreshToken.create({
            data: {
                token,
                userId,
                expiresAt
            }
        })
    }
    
    async findRefreshToken(refreshToken: string) {
        const token = await prisma.refreshToken.findUnique({
            where: { token: refreshToken }
        })

        return token
    }

    async deleteRefresh(id: string) {
        await prisma.refreshToken.delete({
            where: {id}
        })
    }


}