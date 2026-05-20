import Joi from 'joi'

// ─── Registration & Verification ────────────────────────────────────────────

export const register = Joi.object({
    name: Joi.string().trim().max(50).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(8).max(128).required(),
    passwordConfirm: Joi.valid(Joi.ref('password')).required().messages({
        'any.only': 'Passwords do not match',
    }),
    role: Joi.string().valid('CUSTOMER', 'VENUE_OWNER').default('CUSTOMER'),
    phone_number: Joi.string().trim().optional(),
})

export const verifyEmail = Joi.object({
    email: Joi.string().email().lowercase().required(),
    otp: Joi.string().length(6).pattern(/^[0-9a-fA-F]+$/).required().messages({
        'string.length': 'OTP must be exactly 6 digits',
        'string.pattern.base': 'OTP must contain only hexadecimal characters',
    }),
})

export const resendVerificationOTP = Joi.object({
    email: Joi.string().email().lowercase().required(),
})

// ─── Login & Token Refresh ───────────────────────────────────────────────────

export const login = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().required(),
})

// export const refreshToken = Joi.object({
//     refreshToken: Joi.string().required(),
// })

// ─── Password Reset ──────────────────────────────────────────────────────────

export const forgotPassword = Joi.object({
    email: Joi.string().email().lowercase().required(),
})

export const resetPassword = Joi.object({
    email: Joi.string().email().lowercase().required(),
    otp: Joi.string().length(6).pattern(/^\d+$/).required().messages({
        'string.length': 'OTP must be exactly 6 digits',
        'string.pattern.base': 'OTP must contain only digits',
    }),
    password: Joi.string().min(8).max(128).required(),
    passwordConfirm: Joi.valid(Joi.ref('password')).required().messages({
        'any.only': 'Passwords do not match',
    }),
})