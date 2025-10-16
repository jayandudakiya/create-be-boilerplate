// utils/sendEmail.js
import { createTransport } from 'nodemailer';
import AppError from './appError.js';

// --------------------------------
// Validate environment variables
// --------------------------------
const { GMAIL_USER, GMAIL_PASS } = process.env;
if (!GMAIL_USER || !GMAIL_PASS) {
  throw new AppError(
    'GMAIL_USER and GMAIL_PASS must be set in environment variables',
    500
  );
}

// --------------------------------
// Create a reusable transporter
// --------------------------------
const transporter = createTransport({
  service: 'Gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});

/**
 * Send an email using Gmail
 * @param {Object} params
 * @param {string|string[]} params.to - Recipient email(s)
 * @param {string} params.subject - Email subject
 * @param {string} params.html - HTML content
 * @param {string} [params.text] - Optional plain text content
 * @returns {Promise<string>} - Message ID of sent email
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  if (!to || !subject || (!html && !text)) {
    throw new AppError(
      'Email, subject and html/text content are required',
      400
    );
  }

  try {
    const info = await transporter.sendMail({
      from: `"ARC" <${GMAIL_USER}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]+>/g, ''), // fallback plain text
    });

    return info.messageId;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new AppError('Failed to send email', 500);
  }
};
