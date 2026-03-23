import { sign, verify } from "jsonwebtoken";
import { randomUUID } from "node:crypto";

export class TokenProvider {
    generate(payload: object): string{
        const secret = String(process.env.SECRET)

        const token = sign(payload, secret, { expiresIn: "15m"})

        return token
    }

    verify(token: string): object {
        const secret = String(process.env.SECRET)

        const payload = verify(token, secret)
        
        return payload as object
    }

    generateRefreshToken(): string {
        const refreshToken = randomUUID()

        return refreshToken
    }
}