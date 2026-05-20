import mailService from "../../services/mail/mail.service.js";
import tokenService from "../../services/token/token.service.js";
import AppError from "../../utils/AppError.js";
import userRepository from "../user/user.repository.js";

const OTP_TTL_MS = 10 * 60 * 1000 // 10 Minutes

const ROLE_MAP = {
    venue_owner: 'VENUE_MANAGER',
    user: 'CUSTOMER'
}

class AuthService {
    /**
     * Register a new user
     * @param {Object} userData 
     * @returns {Object} Object containing user and tokens
     */
    async register(userData) {
        const existingUser = await userRepository.findOne({ email: userData.email });
        if (existingUser) throw new AppError('An account with this email already exists', 409);

        const hashedPassword = await tokenService.hashPassword(userData.password);
        const otp = tokenService.generateOTPTokens()

        // Map name to fullName as expected by the User model
        const name = userData.name

        const newUser = await userRepository.createUser({
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            role: ROLE_MAP[userData.role] ?? 'CUSTOMER',
            emailVerificationToken: tokenService.hashToken(otp),
            emailVerificationTokenExpiresAt: new Date(Date.now() + OTP_TTL_MS)
        });

        Promise.all([
            mailService.sendWelcomeEmail(userData.name, userData.email),
            mailService.sendEmailVerificationOTP(userData.name, userData.email, otp)
        ])

        return userData;
    }

    /**
     * Verify email with OTP. Returns auth tokens on success.
     * @param {String} email
     * @param {String} otp  — the 6-digit code the user typed
     */
    async verifyEmail(email, otp) {
        const user = await userRepository.findOne(
            { email },
            '+emailVerificationToken +emailVerificationTokenExpiresAt'
        )

        if (!user) throw new AppError('User not found', 404)
        if (user.isVerified) throw new AppError('Email is already verified', 400)

        this.#assertOTPValid(
            otp,
            user.emailVerificationToken,
            user.emailVerificationTokenExpiresAt,
            'Verification OTP'
        )

        await userRepository.updateById(user._id, {
            isVerified: true,
            emailVerificationToken: null,
            emailVerificationTokenExpiresAt: null,
        })

        return { message: 'Email verified successfully' }
    }

    /**
     * Resend email verification OTP (rate-limit this endpoint in your router).
     * @param {String} email
     */
    async resendVerificationOTP(email) {
        const user = await userRepository.findOne({ email })

        if (!user) throw new AppError('User not found', 404)
        if (user.isVerified) throw new AppError('Email is already verified', 400)

        const otp = tokenService.generateOTPTokens()

        await userRepository.updateById(user._id, {
            emailVerificationToken: tokenService.hashToken(otp),
            emailVerificationTokenExpiresAt: new Date(Date.now() + OTP_TTL_MS),
        })

        await mailService.sendEmailVerificationOTP(user.name, user.email, otp)

        return { message: 'Verification code sent to your email' }
    }

    /**
     * Login an existing user
     * @param {String} email 
     * @param {String} password 
     * @returns {Object} Object containing user and tokens
     */
    async login(email, password) {
        // +password because it's select:false in the schema
        const user = await userRepository.findOne({ email }, '+password')

        if (!user.email || !(await tokenService.comparePassword(password, user.password))) throw new AppError('Invalid email or password', 401);
        if (!user.isActive) throw new AppError('Your account has been deactivated', 403);

        // Update the last login time
        await userRepository.updateById(user._id, { lastLoginAt: new Date() });

        const tokens = await tokenService.generateAuthTokens(user._id);

        return { tokens, user };
    }

    /**
     * Refresh auth tokens using a valid refresh token
     * @param {String} refreshToken 
     * @returns {Object} Object containing user and new tokens
     */
    // async refreshToken(refreshToken) {
    //     try {
    //         const decoded = await tokenService.verifyRefreshToken(refreshToken);
    //         const user = await userRepository.findUserById(decoded.sub);

    //         if (!user) {
    //             throw new AppError('User not found', 401);
    //         }
    //         if (!user.isActive) {
    //             throw new AppError('Your account has been deactivated', 403);
    //         }

    //         const tokens = await tokenService.generateAuthTokens(user._id);
    //         return { user, tokens };
    //     } catch (error) {
    //         throw new AppError('Invalid or expired refresh token', 401);
    //     }
    // }

    /**
     * Generate a password reset token for the user
     * @param {String} email 
     * @returns {Object} Reset token (typically sent via email)
     */
    async forgotPassword(email) {
        const user = await userRepository.findOne({ email });
        if (user) {
            const otp = tokenService.generateOTPTokens()

            await userRepository.updateById(user._id, {
                passwordResetToken: tokenService.hashToken(otp),
                passwordResetTokenExpiresAt: new Date(Date.now() + OTP_TTL_MS),
            })
            mailService.sendEmailVerificationOTP(user.name, user.email, otp)
        }

        return { message: 'If an account with that email exists, a reset code has been sent.' }
    }

    /**
     * Reset the user's password using the token
     * @param {String} resetToken 
     * @param {String} newPassword 
     * @returns {Object} Object containing user and new tokens
     */
    async resetPassword(email, otp, newPassword) {
        const user = await userRepository.findOne(
            { email },
            '+passwordResetToken +passwordResetTokenExpiresAt'
        )

        if (!user) throw new AppError('Invalid request', 400)

        this.#assertOTPValid(
            otp,
            user.passwordResetToken,
            user.passwordResetTokenExpiresAt,
            'Password reset OTP'
        )

        const hashedPassword = await tokenService.hashPassword(newPassword)

        await userRepository.updateById(user._id, {
            password: hashedPassword,
            passwordResetToken: null,
            passwordResetTokenExpiresAt: null,
            passwordChangedAt: new Date(),
        })

        return { message: 'Password reset successfully' }
    }

    #assertOTPValid(rawOTP, storedHash, expiresAt, label = 'OTP') {
        if (!storedHash || !expiresAt) throw new AppError(`No ${label} found. Please request a new one.`, 400)

        if (tokenService.hashToken(rawOTP) !== storedHash) throw new AppError(`Invalid ${label}`, 400)

        if (new Date() > expiresAt) throw new AppError(`${label} has expired. Please request a new one.`, 400)


    }
}

const authService = new AuthService();

export default authService;