// lib/email-service.ts
import { Resend } from 'resend';
import { render as _render } from '@react-email/render';
import React from 'react';
import {
  OrderConfirmationEmail,
  SubscriptionConfirmationEmail,
  SubscriptionFailureEmail,
  QuestionnaireEmail
} from './email-templates';

const RESEND_API_KEY = process.env.RESEND_API_KEY;

let resend: Resend | null = null;
function getResend() {
  if (!RESEND_API_KEY) return null;
  if (!resend) resend = new Resend(RESEND_API_KEY);
  return resend;
}

interface EmailOptions {
  email: string;  // Remove underscore
  companyName: string;
  to: string;
  subject: string;
  react: React.ReactElement;
  from?: string;
}

async function sendEmail({ to, subject, react, from }: EmailOptions) {
  try {
    const client = getResend();
    
    // Determine the from email - use verified domain or test email
    const fromEmail = from || process.env.FROM_EMAIL || 'Fabiel.Net <noreply@fabiel.net>';
    
    if (!client) {
      console.warn('[email-service] RESEND_API_KEY not set; performing dry-run send', { to, subject, from: fromEmail });
      return { id: 'dry-run', to: [to], subject } as any;
    }
    
    console.log('[email-service] Attempting to send email:', { to, subject, from: fromEmail });

    const { data, error } = await client.emails.send({
      from: fromEmail,
      to: [to],
      subject,
      react,
    });

    if (error) {
      console.error('[email-service] Resend error:', error);
      const err = error as any;
      const code = err?.statusCode || err?.code;
      const name = err?.name || 'resend_error';
      const message = err?.message || 'Unknown error';
      const e = new Error(message) as any;
      e.statusCode = code;
      e.name = name;
      throw e;
    }

    console.log('[email-service] Email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('[email-service] Failed to send email:', error);
    throw error;
  }
}

// Send consolidated order confirmation with questionnaire link
export const sendOrderConfirmation = async (data: {
  email: string;
  companyName: string;
  customerName: string;
  orderId: string;
  totalAmount: number;
  token?: string;
  questionnaireToken?: string;
  subscriptions?: Array<{name: string; amount: number; frequency: string}>;
}) => {
  return sendEmail({
    email: data.email,
    companyName: data.companyName,
    to: data.email,
    subject: `Order Confirmation - ${data.companyName}`,
    react: OrderConfirmationEmail({ ...data, _email: data.email })
  });
};

// Legacy function for backward compatibility
export const sendLLCConfirmation = sendOrderConfirmation;

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
    email: data.email,
    companyName: data.companyName,
    to: data.email,
    subject: `${data.serviceName} Activated - ${data.companyName}`,
    react: SubscriptionConfirmationEmail({ ...data, _email: data.email })
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
    email: data.email,
    companyName: data.companyName,
    to: data.email,
    subject: `Action Required - ${data.serviceName} Setup Failed`,
    react: SubscriptionFailureEmail({ ...data, _email: data.email })
  });
};

export const sendQuestionnaireLink = async (data: {
  email: string;
  customerName: string;
  companyName: string;
  orderId: string;
  questionnaires: string[];
  token?: string;
}) => {
  return sendEmail({
    email: data.email,
    companyName: data.companyName,
    to: data.email,
    subject: `Complete Your LLC Setup - ${data.companyName}`,
    react: QuestionnaireEmail({ ...data, _email: data.email })
  });
};
