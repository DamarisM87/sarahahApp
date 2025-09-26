import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // keep creds in .env, not code!
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `"Hola amigo" <${process.env.EMAIL_USER}>`,
    to: to || "damarisflamingsword@gmail.com",
    subject: subject || "Hello ✔",
    html: html || "<b>Hello world?</b>",
    attachments,
  });

  return info.accepted.length > 0;
};
