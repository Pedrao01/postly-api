import { z } from "zod"

export const createUserSchema = z.object({
    name: z.string().min(3, 'Very short name'),
    email: z.string().email('Invalid E-mail'),
    password: z.string().min(8, 'The password must be at least 8 characters long')
})

export const updateUseSchema = z.object({
    name: z.string().min(3, 'Very short name').optional(),
    email: z.string().email('Invalid E-mail').optional(),
}).refine(data => data.name || data.email, {
    message: 'You must provide at least one of the fields listed'
})

export const updatePasswordUserSchema = z.object({
    password: z.string().min(8, 'The new password must be at least 8 character long')
})

export const authLogin = z.object({
    email: z.string().email('Invalid E-mail'),
    password: z.string().min(8, 'The password must be at least 8 characters long')
})