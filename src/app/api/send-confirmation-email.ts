import nodemailer from 'nodemailer';
import { NextApiRequest, NextApiResponse } from 'next';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderId, email, companyName, total } = req.body;

    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: email,
      subject: `LLC Formation Order Confirmation - ${companyName}`,
      html: `...` // (Use your HTML template from above)
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Failed to send confirmation email' });
  }
}