import { APP_NAME, baseTemplate, p } from './base.template.js'

export const subject = `Welcome to ${APP_NAME}! 🎉`

export const html = (name) =>
    baseTemplate(`Welcome aboard, ${name}!`, [
        p(`Hi <strong>${name}</strong>,`),
        p(`Welcome to <strong>${APP_NAME}</strong>! We're thrilled to have you with us.`),
        p(`We've sent a separate email with a verification code — use it to confirm your address and get fully set up.`),
        p(`If you have any questions, just reply to this email.`),
        p(`Cheers,<br><strong>The ${APP_NAME} Team</strong>`),
    ].join(''))