import nodemailer from 'nodemailer';

type SendMailParams = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_AUTH_USER,
    pass: process.env.SMTP_AUTH_PASS
  }
});

export const sendMail = async ({ to, subject, text, html }: SendMailParams) => {
  const from = process.env.SENDER_EMAIL;

  if (!from) {
    throw { status: 500, message: 'SENDER_EMAIL is not configured' };
  }

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html
  });
};
