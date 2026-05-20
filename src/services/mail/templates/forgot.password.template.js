import { APP_NAME, baseTemplate, p, muted, otpBlock } from './base.template.js'

export const subject = 'Reset your password'

export const html = (name, otp) =>
    baseTemplate('Password Reset', [
        p(`Hi <strong>${name}</strong>,`),
        p(`We received a request to reset the password for your ${APP_NAME} account. Use the code below.`),
        otpBlock(otp),
        muted(`Didn't request a password reset? You can safely ignore this email. Your password won't change.`),
    ].join(''))