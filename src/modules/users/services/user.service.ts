import { prisma } from "../../../database/prismaClient";
import { AppError } from "../../../errors/AppError";
import { Prisma } from "@prisma/client";
import { HashProvider } from "../../../providers/hash/hash.provider";
import { UserRepository } from "../repositories/user.repository";
import { th } from "zod/v4/locales";
import { object } from "zod";

interface CreateUserRequest {
    name: string
    email: string
    password: string
}

interface UpdateUserRequest {
    name?: string
    email?: string
}

export class UserService {
    constructor (
        private userRepository: UserRepository,
        private hashProvider: HashProvider
    ) {}
    async create({name, email, password}: CreateUserRequest) {
        const userExist =  await this.userRepository.findByEmail(email)

        if (userExist) {
            throw new AppError('This E-mail already exists', 409)
        }
        const hashPassword = await this.hashProvider.hash(password)

        const user = await this.userRepository.create({name, email, password: hashPassword})
        
        return user

    }

    async list(){
        const users = await this.userRepository.list()

        return users
    }

    async getById(id: string) {
        const user =  await this.userRepository.findById(id)

        if (!user) {
            throw new AppError('user not found', 404)
        }

        return user
    }

    async update(id: string, { name, email }: UpdateUserRequest) {
        const user =  await this.userRepository.findById(id)

        if (!user) {
            throw new AppError('User not exists', 404)
        }

        if (email) {
            const emailInUse = await this.userRepository.findByEmail(email)
            if (emailInUse && emailInUse.id !== id) {
                throw new AppError('Email already in use', 409)
            }
        }
        const updateUser = await this.userRepository.update(id, { name, email })
        
        return updateUser
    }

    async updatePassword(id: string, password: string) {
        const userExist = await this.userRepository.findById(id)

        if (!userExist) {
            throw new AppError('User not found', 400)
        }

        const hashPassword = await this.hashProvider.hash(password)

        await this.userRepository.updatePassword(id, hashPassword)
    }

    async delete(id: string) {
        try {
            await this.userRepository.delete(id)
        } catch (error){
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new AppError('User not found', 404)
            }
            throw error
        }
    }
}