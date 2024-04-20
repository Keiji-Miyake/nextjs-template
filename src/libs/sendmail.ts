import nodemailer, { SentMessageInfo } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

interface EmailParams {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: EmailParams): Promise<SentMessageInfo> {
  let transportOptions: SMTPTransport.Options;

  if (process.env.NODE_ENV === "development") {
    transportOptions = {
      host: process.env.EMAIL_SERVER,
      port: Number(process.env.EMAIL_PORT) || 1025,
      secure: false,
    };
  } else {
    transportOptions = {
      host: process.env.EMAIL_SERVER,
      port: Number(process.env.EMAIL_PORT) || 587,
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
      },
    };
  }

  const transporter = nodemailer.createTransport(
    transportOptions as SMTPTransport.Options,
  );

  return await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
    text,
  });
}
