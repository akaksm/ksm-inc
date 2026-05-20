import { APP_NAME, baseTemplate, p, muted, otpBlock } from './base.template.js'

export const subject = 'Verify your email address'

export const html = (name, otp) =>
    baseTemplate('Email Verification', [
        p(`Hi <strong>${name}</strong>,`),
        p('Use the code below to verify your email address.'),
        otpBlock(otp),
        muted(`Didn't create an account with ${APP_NAME}? You can safely ignore this email.`),
    ].join(''))