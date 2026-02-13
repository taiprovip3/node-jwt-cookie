import nodemailer from "nodemailer";
import { getEnv } from "./env.util.js";

export const mailTransporter = nodemailer.createTransport({
  host: getEnv('MAIL_HOST', { default: 'smtp.gmail.com' }),
  port: getEnv('MAIL_PORT', { default: 587 }),
  secure: getEnv('MAIL_SECURE', { default: false }),
  auth: {
    user: getEnv('MAIL_USER', { default: 'taito1doraemon@gmail.com' }),
    pass: getEnv('MAIL_PASS', { default: 'wfpvyonbtldotxfd' }),
  },
});

export async function deliveryMailByNodeMailer(to: string, token: string) {
  try {
    const verifyUrl = `${getEnv('APP_URL', { default: 'http://localhost:3000' })}/api/auth/verify-email?token=${token}`;
    const info = await mailTransporter.sendMail({
      from: 'taito1doraemon@gmail.com',
      to,
      subject: "Verify your email",
      html: `
        <p>You signed up. Probably.</p>
        <p>Click the link below to verify your email:</p>
        <a href="${verifyUrl}">${verifyUrl}</a>
        <p>This link expires in 24 hours.</p>
      `
    });
    return info;
  } catch (error) {
    console.error(error);
    return null;
  }
}