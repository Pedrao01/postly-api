import { error } from "node:console";
import { prisma } from "../../../database/prismaClient";
import { AppError } from "../../../errors/AppError";
import { HashProvider } from "../../../providers/hash/hash.provider";
import { Prisma } from "@prisma/client";

interface UserCreateRequest{
    name: string
    email: string
    password: string
}

interface UserUpdateRequest{
    name?: string
    email?: string
}

export class UserRepository {
    async create({ name, email, password }: UserCreateRequest) {
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password
            }
        })

        return user
    }

    async list(){
        const users = await prisma.user.findMany()

        return users
    }

    async findById(id: string){
        const user = await prisma.user.findUnique({
            where: {id}
        })

        return user
    }

    async findByEmail(email: string){
        const user = await prisma.user.findUnique({
            where: {email}
        })

        return user
    }

    async update(id: string, {name, email}: UserUpdateRequest){
        const update = await prisma.user.update({
            where: {id},
            data: {
                name,
                email
            }
        })

        return update
    }

    async updatePassword(id: string, password: string){
        await prisma.user.update({
            where: {id},
            data: {password}
        })
    }

    async delete(id: string){
        await prisma.user.delete({
            where: {id}
        })
    }
}