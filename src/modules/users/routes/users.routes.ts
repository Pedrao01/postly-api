import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";
import { auth } from "../../../middlewares/auth.middleware";
import { authorize } from "../../../middlewares/authorization.middleware";
import { UserRepository } from "../repositories/user.repository";
import { HashProvider } from "../../../providers/hash/hash.provider";

const usersRoutes = Router()

const userRepository = new UserRepository()
const hashProvider = new HashProvider()
const userService = new UserService(userRepository, hashProvider)
const userController = new UserController(userService)

usersRoutes.post('/', userController.create)

usersRoutes.get('/',auth, authorize('USER'), userController.list)

usersRoutes.get('/:id', auth, authorize('USER'), userController.getById)

usersRoutes.put('/:id', auth, authorize('USER'), userController.update)

usersRoutes.put('/update-password/:id',auth, authorize('ADMIN'), userController.updatePassword)

usersRoutes.delete('/:id', auth, authorize('ADMIN'), userController.delete)

export { usersRoutes }