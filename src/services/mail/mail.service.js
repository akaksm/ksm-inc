import mailConfig from './mail.config.js'
import * as welcomeMail from './templates/welcome.template.js'
import * as verifyEmailMail from './templates/verify-email.template.js'
import * as forgotPasswordMail from './templates/forgot-password.template.js'

class MailService {
    async sendWelcomeEmail(name, email) {
        return mailConfig.sendMail({
            to: email,
            subject: welcomeMail.subject,
            html: welcomeMail.html(name)
        })
    }

    async sendEmailVerificationOTP(name, email, otp) {
        return mailConfig.sendMail({
            to: email,
            subject: verifyEmailMail.subject,
            html: verifyEmailMail.html(name, otp)
        })
    }

    async sendForgotPasswordOTP(name, email, otp) {
        return mailConfig.sendMail({
            to: email,
            subject: forgotPasswordMail.subject,
            html: forgotPasswordMail.html(name, otp)
        })
    }
}

const mailService = new MailService()

export default mailService