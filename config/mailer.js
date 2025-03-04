import nodemailer from "nodemailer";
import dotenv from "dotenv";
import otplibSmsVerify from "../utils/otplib.js";
import userSchemas from "../schema/user.schema.js";
dotenv.config();
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_AUTH_NAME,
    pass: process.env.MAIL_AUTH_PASS,
  },
});

export const sendSmsVerify = async ({ to }) => {
  const { password } = otplibSmsVerify();
  const expiresAt = Date.now() + 120 * 1000;
  let code = password({ email: to });
  await userSchemas.updateOne(
    { email: to },
    { $set: { verifyCode: String(code), verifyExpires: expiresAt } }
  );

  await transporter.sendMail({
    from: process.env.MAIL_AUTH_NAME,
    to,
    subject: "Verify code",
    html: `<body style="font-family: Arial, sans-serif; text-align: center; background: #f4f4f4; padding: 40px;">
    <div style="max-width: 400px; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); margin: auto;">
        <h2>Verify Your Account</h2>
        <p>Your verification code is:</p>
        <div style="font-size: 24px; font-weight: bold; color: #2c3e50; background: #ecf0f1; display: inline-block; padding: 10px 20px; border-radius: 5px; letter-spacing: 2px; margin: 20px 0;">${code}</div>
        <p>Please enter this code to verify your email.</p>
        <p style="font-size: 12px; color: #7f8c8d;">If you did not request this code, ignore this email.</p>
    </div>
</body>`,
  });
};
