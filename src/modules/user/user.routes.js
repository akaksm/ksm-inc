import { Router } from "express";
import { authorize, protect } from "../../middleware/authMiddleware";
import { changePassword, deleteMe, deleteUser, getAllUsers, getMe, getUserById, updateMe, updateUser } from "./user.controller";
import { validate } from "../../middleware/validation.middleware";
import * as userValidation from './user.validation.js'



const userRouter = Router()
// ---- Authenticated User (self) ----
userRouter
    .route('/')
    .use(protect)
    .get(getMe)
    .patch(validate(userValidation.updateMe), updateMe)
    .patch(validate(userValidation.changePassword), changePassword)
    .delete(deleteMe)

// ---- Admin Only ----
userRouter
    .route('/')
    .use(authorize('ADMIN'))
    .get(getAllUsers)
    .get(getUserById)
    .patch(updateUser)
    .delete(deleteUser)


