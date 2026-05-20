import { Router } from "express";
import { authorize, protect } from "../../middleware/authMiddleware.js";
import { changePassword, deleteMe, deleteUser, getAllUsers, getMe, getUserById, updateMe, updateUser } from "./user.controller.js";
import { validate } from "../../middleware/validation.middleware.js";
import * as userValidation from './user.validation.js'



const userRouter = Router()
// ---- Authenticated User (self) ----
userRouter.use(protect)

userRouter.get('/me', getMe)
userRouter.patch('/me', validate(userValidation.updateMe), updateMe)
userRouter.patch('/me/password', validate(userValidation.changePassword), changePassword)
userRouter.delete('/me', deleteMe)

// ---- Admin Only ----
userRouter.use(authorize('ADMIN'))

userRouter.get('/', getAllUsers)
userRouter.get('/:id', getUserById)
userRouter.patch('/:id', updateUser)
userRouter.delete('/:id', deleteUser)

export default userRouter
