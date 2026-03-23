import { hash, compare } from "bcrypt"

export class HashProvider {
    async hash(password: string): Promise<string>{
        const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS)

        const hashedPassword = await hash(password, saltRounds)

        return hashedPassword
    }

    async compare(password: string, hash:string): Promise<boolean>{
        const comparePassword = await compare(password, hash)

        return comparePassword

    }
}