/*
  config/email.js - Email Service Configuration
  =================================================================================
  PURPOSE:
  - Configure Nodemailer transporter for Gmail SMTP
  - Provide functions to send OTP emails for password reset
  
  SETUP:
  - Use Gmail App Password (not regular password)
  - Enable 2FA on Gmail account first
  - Generate App Password from: https://myaccount.google.com/apppasswords
  - Set EMAIL and PASS in .env file
  
  IMPORTANT:
  - PASS should be the 16-character Google App Password, not your Gmail password
  - secure: true for port 465 (SSL)
  - secure: false for port 587 (TLS)
=================================================================================
*/

import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

export const sendOtpMail = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject: "Reset Your Password - ProLink",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #24b2ff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">ProLink</h1>
          </div>
          <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
            <p style="font-size: 16px; color: #333;">Hi,</p>
            <p style="font-size: 14px; color: #666;">
              We received a request to reset your password. Use the OTP below to proceed:
            </p>
            <div style="background-color: #fff; border: 2px solid #24b2ff; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <p style="font-size: 32px; font-weight: bold; color: #24b2ff; margin: 0; letter-spacing: 5px;">${otp}</p>
            </div>
            <p style="font-size: 12px; color: #999;">
              This OTP expires in <strong>5 minutes</strong>
            </p>
            <p style="font-size: 14px; color: #666;">
              If you didn't request this, please ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 12px; color: #999;">
              © 2026 ProLink. All rights reserved.
            </p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send OTP email:", error.message);
    throw error;
  }
};

export default transporter;
