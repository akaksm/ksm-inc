import ApiResponse from '../../utils/ApiResponse.js'
import userService from './user.service.js'

// ─── Current user (self) ─────────────────────────────────────────────────────
// These routes sit behind the `protect` auth middleware,
// so req.user is always the authenticated user document.

export const getMe = async (req, res, next) => {
    const user = await userService.getMe(req.user._id)
    res.status(200).json(new ApiResponse(null, user))
}

export const updateMe = async (req, res, next) => {
    const user = await userService.updateMe(req.user._id, req.body)
    res.status(200).json(new ApiResponse(null, user))
}

export const changePassword = async (req, res, next) => {
    const { currentPassword, newPassword } = req.body
    const result = await userService.changePassword(req.user._id, currentPassword, newPassword)
    res.status(200).json(new ApiResponse(null, result))
}

export const deleteMe = async (req, res, next) => {
    const result = await userService.deleteMe(req.user._id)
    res.status(200).json(new ApiResponse(null, result))
}

// ─── Admin ───────────────────────────────────────────────────────────────────
// These routes sit behind both `protect` and `restrictTo('ADMIN')` middleware.

export const getAllUsers = async (req, res, next) => {
    const result = await userService.getAllUsers(req.query)
    res.status(200).json(new ApiResponse(null, result))
}

export const getUserById = async (req, res, next) => {
    const user = await userService.getUserById(req.params.id)
    res.status(200).json(new ApiResponse(null, user))
}

export const updateUser = async (req, res, next) => {
    const user = await userService.updateUser(req.params.id, req.body)
    res.status(200).json(new ApiResponse(null, user))
}

export const deleteUser = async (req, res, next) => {
    const result = await userService.deleteUser(req.params.id)
    res.status(200).json(new ApiResponse(null, result))
}