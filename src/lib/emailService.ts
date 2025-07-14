import nodemailer from 'nodemailer';

// Create a transporter with SMTP configuration
const transporter = nodemailer.createTransport({
  host: 'decisions.social',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'alerts@decisions.social',
    pass: 'DuONN7qH?MP&'
  }
});

// Verify connection configuration
transporter.verify()
  .then(() => console.log('SMTP server connection established successfully'))
  .catch(error => console.error('SMTP connection error:', error));

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send an email using the configured transporter
 */
export const sendEmail = async ({ to, subject, html }: EmailOptions): Promise<boolean> => {
  try {
    const info = await transporter.sendMail({
      from: '"GO AI HUB Admin Portal" <alerts@decisions.social>',
      to,
      subject,
      html
    });
    
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

/**
 * Send a signup confirmation email
 */
export const sendSignupConfirmationEmail = async (email: string, name: string): Promise<boolean> => {
  const subject = 'Welcome to GO AI HUB Admin Portal';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #00afaf;">Welcome to GO AI HUB Admin Portal</h1>
      </div>
      <p>Hello ${name},</p>
      <p>Thank you for signing up for the GO AI HUB Admin Portal. Your account has been created successfully.</p>
      <p>You now have access to evaluate solutions and manage business interests as an Evaluator.</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Email:</strong> ${email}</p>
        <p style="margin: 10px 0 0;"><strong>Role:</strong> Evaluator</p>
      </div>
      <p>If you have any questions or need assistance, please contact our support team.</p>
      <p>Best regards,<br>The GO AI HUB Team</p>
    </div>
  `;
  
  return sendEmail({ to: email, subject, html });
};

/**
 * Send a password reset email with a reset link
 */
export const sendPasswordResetEmail = async (email: string, resetToken: string): Promise<boolean> => {
  const resetLink = `${import.meta.env.VITE_APP_URL || window.location.origin}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
  
  const subject = 'Reset Your GO AI HUB Admin Portal Password';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #00afaf;">Password Reset Request</h1>
      </div>
      <p>Hello,</p>
      <p>We received a request to reset your password for the GO AI HUB Admin Portal.</p>
      <p>To reset your password, please click the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #00afaf; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Reset Password</a>
      </div>
      <p>If you didn't request a password reset, you can ignore this email. Your password will remain unchanged.</p>
      <p>This link will expire in 1 hour for security reasons.</p>
      <p>Best regards,<br>The GO AI HUB Team</p>
    </div>
  `;
  
  return sendEmail({ to: email, subject, html });
};