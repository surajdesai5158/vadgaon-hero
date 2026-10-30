
import nodemailer from 'nodemailer';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

export const sendWelcomeEmail = async (user) => {
  return transporter.sendMail({
    from: `"VADGAON HERO'S" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: 'Welcome to VADGAON HERO\'S!',
    text: `Hello ${user.name},

Welcome to VADGAON HERO'S!

Your registration was successful.

Your account is currently waiting for admin approval. You will be able to log in after the administrator approves your account.

Thank you for joining our village community!

Regards,
VADGAON HERO'S Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #2563eb;">Welcome to VADGAON HERO'S!</h2>
        <p>Hello <strong>${user.name}</strong>,</p>
        <p>Your registration was successful.</p>
        <p>Your account is currently <strong style="color: #d97706;">waiting for admin approval</strong>.</p>
        <p>You will be able to log in after the administrator approves your account.</p>
        <p>Thank you for joining our village community!</p>
        <br />
        <p>Regards,<br /><strong>VADGAON HERO'S Team</strong></p>
      </div>
    `
  });
};

export default transporter;
