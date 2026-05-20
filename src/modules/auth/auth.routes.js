import { Router } from "express"
import { validate } from "../../middleware/validation.middleware.js"
import * as authValidation from './auth.validation.js'
import { forgotPassword, login, register, resendVerificationOTP, resetPassword, verifyEmail } from "./auth.controller.js"


const authRouter = Router()

authRouter
    .route('/')
    .post(validate(authValidation.register), register)
    .post(validate(authValidation.verifyEmail), verifyEmail)
    .post(validate(authValidation.resendVerificationOTP), resendVerificationOTP)
    .post(validate(authValidation.login), login)
    .post(validate(authValidation.forgotPassword), forgotPassword)
    .post(validate(authValidation.resetPassword), resetPassword)

export default authRouter