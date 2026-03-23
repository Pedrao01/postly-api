import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { createUserSchema, updateUseSchema, updatePasswordUserSchema } from "../schemas/users.schema";

export class UserController {
    constructor(
        private userService: UserService
    ) {}
    create = async (req: Request, res: Response) => {
        const data = createUserSchema.parse(req.body)

        const user = await this.userService.create(data)

        return res.json(user)
    }

    list = async (req: Request, res: Response) => {
        const users = await this.userService.list()

        return res.json(users)
    }

    getById = async (req: Request, res: Response) => {
        const { id } = req.params

        const user = await this.userService.getById(id as string)

        return res.json(user)
    }

    update = async (req: Request, res: Response) => {
        const { id } = req.params
        const data = updateUseSchema.parse(req.body)

        const updateUser = await this.userService.update(id as string, data)

        return res.json(updateUser)
    }

    updatePassword = async (req: Request, res: Response) => {
        const { password } = updatePasswordUserSchema.parse(req.body)
        const { id } = req.params

        await this.userService.updatePassword(id as string, password)

        return res.status(204).send()
    }
    
    delete = async (req: Request, res: Response) => {
        const { id } = req.params

        await this.userService.delete(id as string)

        return res.status(204).send()
    }
}