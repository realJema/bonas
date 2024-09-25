import nodemailer from "nodemailer";

const SMTP_SERVER_HOST = process.env.SMTP_SERVER_HOST;
const SMTP_SERVER_USERNAME = process.env.SMTP_SERVER_USERNAME;
const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD;
const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL;

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: SMTP_SERVER_HOST,
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: SMTP_SERVER_USERNAME,
    pass: SMTP_SERVER_PASSWORD,
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const verificationLink = `${NEXT_PUBLIC_APP_URL}/auth/new-verification?token=${token}`;

  try {
    await transporter.sendMail({
      from: `"Your App Name" <${SMTP_SERVER_USERNAME}>`,
      to: email,
      subject: "Verify your email",
      html: `
        <h1>Verify your email</h1>
        <p>Thank you for signing up. Please click the link below to verify your email address:</p>
        <a href="${verificationLink}">Verify Email</a>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
}

// Add a function to test the email setup
export async function testEmailSetup() {
  try {
    await transporter.verify();
    console.log("SMTP connection is valid");
    return true;
  } catch (error) {
    console.error("SMTP connection error:", error);
    return false;
  }
}
