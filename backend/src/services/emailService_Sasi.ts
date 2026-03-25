import nodemailer from 'nodemailer';
import { emailConfig } from '../config/email_Sasi';

function getTransport() {
  if (!emailConfig.host || !emailConfig.user || !emailConfig.pass) {
    return null;
  }

  return nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    secure: emailConfig.port === 465,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.pass,
    },
  });
}

export class EmailService {
  static async sendEmail(to: string, subject: string, html: string) {
    const transport = getTransport();
    if (!transport) {
      return { skipped: true };
    }

    return transport.sendMail({
      from: emailConfig.from,
      to,
      subject,
      html,
    });
  }
}

