import ApiResponse from '../../utils/ApiResponse.js'
import authService from './auth.service.js'

/**
 * Controllers are intentionally thin — no business logic lives here.
 * They extract data from req, call the service, and send the response.
 * All errors bubble up to the global error handler via next(err).
 */

export const register = async (req, res, next) => {
    const result = await authService.register(req.body)
    res.status(201).json(new ApiResponse(`User Created`, result))
}

export const verifyEmail = async (req, res, next) => {
    const { email, otp } = req.body
    const result = await authService.verifyEmail(email, otp)
    res.status(200).json(new ApiResponse(null, ...result))
}

export const resendVerificationOTP = async (req, res, next) => {
    const result = await authService.resendVerificationOTP(req.body.email)
    res.status(200).json(new ApiResponse(null, result))
}

export const login = async (req, res, next) => {
    const { email, password } = req.body
    const result = await authService.login(email, password)
    res.status(200).json(new ApiResponse(null, result))
}

// export const refreshToken = async (req, res, next) => {
//     const result = await authService.refreshToken(req.body.refreshToken)
//     res.status(200).json({ status: 'success', ...result })
// }

export const forgotPassword = async (req, res, next) => {
    const result = await authService.forgotPassword(req.body.email)
    res.status(200).json(new ApiResponse(null, result))
}

export const resetPassword = async (req, res, next) => {
    const { email, otp, password } = req.body
    const result = await authService.resetPassword(email, otp, password)
    res.status(200).json(new ApiResponse(null, result))
}