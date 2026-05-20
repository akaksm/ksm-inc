import { Router } from "express"
import { validate } from "../../middleware/validation.middleware.js"
import * as authValidation from './auth.validation.js'
import { forgotPassword, login, register, resendVerificationOTP, resetPassword, verifyEmail } from "./auth.controller.js"


const authRouter = Router()

authRouter.post('/register', validate(authValidation.register), register)
authRouter.post('/verify-email', validate(authValidation.verifyEmail), verifyEmail)
authRouter.post('/resend-otp', validate(authValidation.resendVerificationOTP), resendVerificationOTP)
authRouter.post('/login', validate(authValidation.login), login)
authRouter.post('/forgot-password', validate(authValidation.forgotPassword), forgotPassword)
authRouter.post('/reset-password', validate(authValidation.resetPassword), resetPassword)

export default authRouter