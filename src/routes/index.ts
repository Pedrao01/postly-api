import { Router } from "express";
import { usersRoutes } from "../modules/users/routes/users.routes";
import { authRoutes } from "../modules/auth/auth.routes";

const routes = Router()

routes.use('/users', usersRoutes)
routes.use('/auth', authRoutes)

export { routes }