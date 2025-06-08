import nodemailer from 'nodemailer';
import { ConfigHandler } from './configHandler';
import { log } from './log';

export class MailHandler {
    static transporter: nodemailer.Transporter;

    static async sendMail(to: string, subject: string, text: string): Promise<void> {
        var transporter = nodemailer.createTransport({
            host:  ConfigHandler.config.settings.mail.mailHost,
            port:  ConfigHandler.config.settings.mail.mailPort,
            secure: ConfigHandler.config.settings.mail.mailSecure, 
            auth: {
                user: ConfigHandler.config.settings.mail.mailUser,
                pass: ConfigHandler.config.settings.mail.mailPass
            }});
        try {
            await transporter.sendMail({
                from:  "test123@test.se",
                to: to,
                subject: subject,
                text: text
            }, (error, info)=> {
                if(error){
                    log(`Error sending email to ${to}: ${error}`, "error");
                    return;
                }

                //log(`Email sent to ${to}: ${info.response}`);
            });

        } catch (error) {
            console.error(`Failed to send email to ${to}:`, error);
        }
    }

        static async sendHtmlMail(to: string, subject: string, html: string): Promise<void> {
        var transporter = nodemailer.createTransport({
            host:  ConfigHandler.config.settings.mail.mailHost,
            port:  ConfigHandler.config.settings.mail.mailPort,
            secure: ConfigHandler.config.settings.mail.mailSecure, 
            auth: {
                user: ConfigHandler.config.settings.mail.mailUser,
                pass: ConfigHandler.config.settings.mail.mailPass
            }});
        try {
            await transporter.sendMail({
                from:  "test123@test.se",
                to: to,
                subject: subject,
                html: html
            }, (error, info)=> {
                if(error){
                    log(`Error sending email to ${to}: ${error}`, "error");
                    return;
                }

                //log(`Email sent to ${to}: ${info.response}`);
            });

        } catch (error) {
            console.error(`Failed to send email to ${to}:`, error);
        }
    }
}