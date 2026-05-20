import nodemailer from 'nodemailer'
import { email_from, email_host, email_pass, email_port, email_user } from '../../config.js'



const transporter = nodemailer.createTransport({
    host: email_host,
    port: Number(email_port),
    // secure: false
    auth: {
        user: email_user,
        pass: email_pass
    }
})

class MailConfig {
    async sendMail({ to, subject, html }) {
        return transporter.sendMail({
            from: email_from,
            to,
            subject,
            html
        })
    }
}
const mailConfig = new MailConfig()

export default mailConfig

