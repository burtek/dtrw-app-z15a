import * as mailer from 'nodemailer';

import { env } from '../config';


export class MailerService {
    private readonly transport = mailer.createTransport(
        {
            service: 'Gmail',
            auth: {
                user: env.EMAIL_SMTP_USER,
                pass: env.EMAIL_SMTP_PASS
            }
        },
        { from: env.EMAIL_FROM }
    );

    async checkTransporter() {
        await this.transport.verify();
    }

    async sendMail(arg: mailer.SendMailOptions) {
        return await this.transport.sendMail(arg);
    }
}
