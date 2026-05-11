import { Resend } from 'resend';

let resendClient: Resend | null = null;

export function getResendClient(): Resend {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

// Keep createTransporter export so existing emailService_Sasi.ts still compiles
// (it won't be called when RESEND_API_KEY is set)
export async function createTransporter() {
  throw new Error('Use Resend instead of Nodemailer');
}
