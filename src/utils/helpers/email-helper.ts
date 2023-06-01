import nodemailer from "nodemailer";
import { Env } from "../../config";
import { User } from "../../models";

function generateEmail(email: string, subject: string, template: string) {
  return {
    from: `"no-reply" <${Env.GMAIL_EMAIL}>`, // sender address
    to: email,
    subject,
    html: template,
  };
}

async function sendEmail(email: string, subject: string, template: string) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: Env.GMAIL_EMAIL,
        pass: Env.GMAIL_PASS,
      },
    });
    const msg = generateEmail(email, subject, template);
    await transporter.sendMail(msg);
  } catch (err: any) {
    throw new Error(err.message);
  }
}

async function verifyOtp(
  code: string,
  username: string,
  purpose: OtpPurpose,
  role: Roles
) {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error("user not found");
    }
    if (!user.sms) {
      throw new Error("no otp found");
    }
    if (
      user.sms.code === code &&
      user.sms.purpose === purpose &&
      user.sms.expires > new Date()
    ) {
      user.sms.code = "";
      await user.save();
      return true;
    }
    throw new Error("invalid otp");
  } catch (err: any) {
    throw new Error(err.message);
  }
}

export { sendEmail, verifyOtp };
