import tokenService from '../../services/token/token.service.js'
import AppError from '../../utils/AppError.js'
import userRepository from './user.repository.js'

// Fields a user is allowed to update on their own profile.
// Anything not in this list (role, isVerified, isActive…) is admin-only.
const ALLOWED_UPDATE_FIELDS = ['name', 'phoneNumber', 'preferredCity', 'avatar']

class UserService {
    // ─── Current user (self) ─────────────────────────────────────────────────
    /**
     * Get the authenticated user's profile.
     * @param {String} userId
     */
    async getMe(userId) {
        const user = await userRepository.findUserById(userId)
        if (!user) throw new AppError('User not found', 404)
        return user
    }

    /**
     * Update the authenticated user's own profile.
     * Prevents users from elevating their own role or verifying themselves.
     * @param {String} userId
     * @param {Object} body  — raw request body
     */
    async updateMe(userId, body) {
        const updates = {}
        for (const field of ALLOWED_UPDATE_FIELDS) {
            if (body[field] !== undefined) updates[field] = body[field]
        }

        if (Object.keys(updates).length === 0) {
            throw new AppError('No valid fields provided for update', 400)
        }

        const user = await userRepository.updateById(userId, updates)
        if (!user) throw new AppError('User not found', 404)
        return user
    }

    /**
     * Change the authenticated user's password.
     * Requires the current password for verification.
     * @param {String} userId
     * @param {String} currentPassword
     * @param {String} newPassword
     */
    async changePassword(userId, currentPassword, newPassword) {
        const user = await userRepository.findUserById(userId, '+password')
        if (!user) throw new AppError('User not found', 404)

        const isMatch = await tokenService.comparePassword(currentPassword, user.password)
        if (!isMatch) throw new AppError('Current password is incorrect', 401)

        const hashed = await tokenService.hashPassword(newPassword)

        await userRepository.updateById(userId, {
            password: hashed,
            passwordChangedAt: new Date(),
        })

        return { message: 'Password changed successfully' }
    }

    /**
     * Soft-delete: deactivate the authenticated user's own account.
     * @param {String} userId
     */
    async deleteMe(userId) {
        const user = await userRepository.updateById(userId, { isActive: false })
        if (!user) throw new AppError('User not found', 404)
        return { message: 'Account deactivated successfully' }
    }

    // ─── Admin ───────────────────────────────────────────────────────────────

    /**
     * Paginated list of all users (admin only).
     * @param {Object} query  — parsed from req.query
     */
    async getAllUsers(query = {}) {
        const { page = 1, limit = 10, sort = '-createdAt', role, isActive, isVerified } = query

        const filter = {}
        if (role) filter.role = role
        if (isActive !== undefined) filter.isActive = isActive === 'true'
        if (isVerified !== undefined) filter.isVerified = isVerified === 'true'

        return userRepository.paginate(filter, {
            page: Number(page),
            limit: Number(limit),
            sort,
        })
    }

    /**
     * Get any user by ID (admin only).
     * @param {String} userId
     */
    async getUserById(userId) {
        const user = await userRepository.findUserById(userId)
        if (!user) throw new AppError('User not found', 404)
        return user
    }

    /**
     * Update any user's profile or status (admin only).
     * Admin can update role, isActive, isVerified etc.
     * @param {String} userId
     * @param {Object} data
     */
    async updateUser(userId, data) {
        // Prevent direct password updates through this route
        if (data.password) throw new AppError('Use the change-password endpoint to update passwords', 400)

        const user = await userRepository.updateById(userId, data)
        if (!user) throw new AppError('User not found', 404)
        return user
    }

    /**
     * Hard-delete a user (admin only).
     * @param {String} userId
     */
    async deleteUser(userId) {
        const user = await userRepository.deleteById(userId)
        if (!user) throw new AppError('User not found', 404)
        return { message: 'User deleted successfully' }
    }
}

const userService = new UserService()

export default userService