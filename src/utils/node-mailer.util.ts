import nodemailer from "nodemailer";
import { getEnv } from "./env.util.js";

export const mailTransporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: 'taito1doraemon@gmail.com',
    pass: 'wfpvyonbtldotxfd',
  }
});

export async function deliveryMailByNodeMailer(to: string, token: string) {
  try {
    const verifyUrl = `${getEnv('APP_URL')}/api/auth/verify-email?token=${token}`;
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