import * as mailer from 'nodemailer';

import { env } from '../config';


const transporter = mailer.createTransport(
    {
        service: 'Gmail',
        auth: {
            user: env.EMAIL_SMTP_USER,
            pass: env.EMAIL_SMTP_PASS
        }
    },
    { from: env.EMAIL_FROM }
);

await transporter.verify();

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

    async sendMail(arg: mailer.SendMailOptions) {
        return await transporter.sendMail(arg);
    }
}
