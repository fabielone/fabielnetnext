// lib/email-service.ts
import { Resend } from 'resend';
import { render } from '@react-email/render';
import {
  LLCConfirmationEmail,
  SubscriptionConfirmationEmail,
  SubscriptionFailureEmail,
  QuestionnaireEmail
} from './email-templates';

const resend = new Resend(process.env.RESEND_API_KEY!);

interface EmailOptions {
  to: string;
  subject: string;
  react: React.ReactElement;
  from?: string;
}

async function sendEmail({ to, subject, react, from }: EmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: from || process.env.FROM_EMAIL || 'LLC Formation <noreply@fabiel.net>',
      to: [to],
      subject,
      react,
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error(`Email failed: ${error.message}`);
    }

    console.log('Email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

export const sendLLCConfirmation = async (data: {
  email: string;
  companyName: string;
  customerName: string;
  orderId: string;
  totalAmount: number;
}) => {
  return sendEmail({
    to: data.email,
    subject: `LLC Formation Confirmation - ${data.companyName}`,
    react: LLCConfirmationEmail(data)
  });
};

export const sendSubscriptionConfirmation = async (data: {
  email: string;
  customerName: string;
  serviceName: string;
  amount: number;
  frequency: string;
  subscriptionId: string;
  companyName: string;
}) => {
  return sendEmail({
    to: data.email,
    subject: `${data.serviceName} Activated - ${data.companyName}`,
    react: SubscriptionConfirmationEmail(data)
  });
};

export const sendSubscriptionFailure = async (data: {
  email: string;
  customerName: string;
  serviceName: string;
  companyName: string;
  error: string;
}) => {
  return sendEmail({
    to: data.email,
    subject: `Action Required - ${data.serviceName} Setup Failed`,
    react: SubscriptionFailureEmail(data)
  });
};

export const sendQuestionnaireLink = async (data: {
  email: string;
  customerName: string;
  companyName: string;
  orderId: string;
  questionnaires: string[];
}) => {
  return sendEmail({
    to: data.email,
    subject: `Complete Your LLC Setup - ${data.companyName}`,
    react: QuestionnaireEmail(data)
  });
};
