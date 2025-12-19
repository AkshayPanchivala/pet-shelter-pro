import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken, userName) => {
  const transporter = createTransporter();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const mailOptions = {
    from: `"Pet Shelter Pro" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset Request - Pet Shelter Pro',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
           <img
  src="https://res.cloudinary.com/ddhrg2lvw/image/upload/v1766133083/pet-adoption/rhmt07qivfmiyephd5no.png"
  alt="Pet Shelter Pro"
  style="max-width: 180px; height: auto;"
/>
          </div>
          <div class="content">
            <h2>Hello ${userName},</h2>
            <p>We received a request to reset your password. Click the button below to reset it:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #10b981;">${resetUrl}</p>
            <p><strong>This link will expire in 1 hour.</strong></p>
            <p>If you didn't request a password reset, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Pet Shelter Pro. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent to:', email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

// Send application approval email
export const sendApplicationApprovedEmail = async (email, userName, petName, adminName) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Pet Shelter Pro" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `🎉 Your Application for ${petName} has been Approved!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .success-badge { background: #d1fae5; color: #065f46; padding: 10px 20px; border-radius: 5px; display: inline-block; margin: 15px 0; font-weight: bold; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img
  src="https://res.cloudinary.com/ddhrg2lvw/image/upload/v1766133083/pet-adoption/rhmt07qivfmiyephd5no.png"
  alt="Pet Shelter Pro"
  style="max-width: 180px; height: auto;"
/>
          </div>
          <div class="content">
            <h2>Congratulations ${userName}! 🎉</h2>
            <div class="success-badge">✓ APPLICATION APPROVED</div>
            <p>We're thrilled to inform you that your application to adopt <strong>${petName}</strong> has been approved!</p>
            <p><strong>Reviewed by:</strong> ${adminName}</p>
            <p><strong>Next Steps:</strong></p>
            <ol>
              <li>We will contact you within 24-48 hours with further instructions</li>
              <li>Please prepare your home for ${petName}'s arrival</li>
              <li>Have all necessary supplies ready</li>
            </ol>
            <p>Thank you for choosing to adopt and giving ${petName} a loving home!</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Pet Shelter Pro. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Application approved email sent to:', email);
  } catch (error) {
    console.error('Error sending application approved email:', error);
    throw new Error('Failed to send application approved email');
  }
};

// Send application rejection email
export const sendApplicationRejectedEmail = async (email, userName, petName, adminName) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Pet Shelter Pro" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Application Update for ${petName} - Pet Shelter Pro`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img
  src="https://res.cloudinary.com/ddhrg2lvw/image/upload/v1766133083/pet-adoption/rhmt07qivfmiyephd5no.png"
  alt="Pet Shelter Pro"
  style="max-width: 180px; height: auto;"
/>
          </div>
          <div class="content">
            <h2>Hello ${userName},</h2>
            <p>Thank you for your interest in adopting <strong>${petName}</strong>.</p>
            <p>After careful consideration, we regret to inform you that your application has not been approved at this time.</p>
            <p><strong>Reviewed by:</strong> ${adminName}</p>
            <p>We appreciate your interest in providing a home for our animals. Please don't be discouraged - we encourage you to browse our other available pets and apply again!</p>
            <a href="${process.env.FRONTEND_URL}" class="button">Browse Available Pets</a>
            <p>Thank you for your understanding and continued support.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Pet Shelter Pro. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Application rejected email sent to:', email);
  } catch (error) {
    console.error('Error sending application rejected email:', error);
    throw new Error('Failed to send application rejected email');
  }
};
