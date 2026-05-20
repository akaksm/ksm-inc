import jwt from 'jsonwebtoken'
import AppError from '../utils/AppError'
import { jwt_secret } from '../config'
import userRepository from '../modules/user/user.repository'


export const protect = async (req, res, next) => {
    let token

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1]
    }

    if (!token) throw new AppError('Not authenticated, Please log in', 401)

    // Verify signature and expiry
    const decoded = jwt.verify(token, jwt_secret)

    // check the user still exists in DB
    const user = await userRepository.findUserById(decoded.sub)

    if (!user || !user.isActive) throw new AppError('User belonging to this token no longer exists', 401)

    req.user = user
    next()
}

// Restrict - limits access to specific roles
export const authorize = (...roles) => (req, res, next) => {

    if (!roles.includes(req.user.role)) throw new AppError('You do not have permission to perform this action', 403)

    next()
}