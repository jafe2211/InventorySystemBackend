import nodemailer from 'nodemailer';
import { ConfigHandler } from './configHandler';

export class MailHandler {
    static transporter: nodemailer.Transporter;

    static async sendMail(to: string, subject: string, text: string): Promise<void> {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: ConfigHandler.config.settings.mailUser,
                pass: ConfigHandler.config.settings.mailPass
            }});
        try {
            await transporter.sendMail({
                from: ConfigHandler.config.settings.mailUser,
                to: to,
                subject: subject,
                text: text
            }, ()=> {});
            console.log(`Email sent to ${to} with subject "${subject}"`);
        } catch (error) {
            console.error(`Failed to send email to ${to}:`, error);
        }
    }
}