
// lib/email-templates.tsx
import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Hr,
  Img
} from '@react-email/components';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://fabiel.net';

// Consolidated Order Confirmation Email with Questionnaire Link
export const OrderConfirmationEmail = ({ 
  _email, 
  companyName, 
  customerName, 
  orderId, 
  totalAmount, 
  token,
  questionnaireToken,
  subscriptions = [],
  packageItems = ['LLC Formation', 'EIN Application', 'Operating Agreement', 'Bank Resolution Letter']
}: { 
  _email: string; 
  companyName: string; 
  customerName: string; 
  orderId: string; 
  totalAmount: number; 
  token?: string;
  questionnaireToken?: string;
  subscriptions?: Array<{name: string; amount: number; frequency: string}>;
  packageItems?: string[];
}) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Img
            src={`${baseUrl}/logo.png`}
            width="150"
            height="50"
            alt="Fabiel.net"
            style={logo}
          />
        </Section>
        
        <Section style={content}>
          <Heading style={h1}>LLC Formation Order Confirmed! 🎉</Heading>
          
          <Text style={text}>
            Dear {customerName},
          </Text>
          
          <Text style={text}>
            Thank you for choosing Fabiel.net for your LLC formation. 
            Your order has been successfully received and payment processed.
          </Text>
          
          <Section style={orderDetails}>
            <Heading style={h2}>Order Summary</Heading>
            <Text style={orderText}>
              <strong>Order ID:</strong> {orderId}<br/>
              <strong>Company Name:</strong> {companyName}<br/>
              <strong>Amount Paid:</strong> ${totalAmount.toFixed(2)}<br/>
              <strong>Status:</strong> Processing
            </Text>
          </Section>

          {/* Package Items Included */}
          <Section style={packageSection}>
            <Heading style={h2}>Your Package Includes</Heading>
            {packageItems.map((item, index) => (
              <Text key={index} style={packageItem}>
                ✓ {item}
              </Text>
            ))}
          </Section>

          {subscriptions && subscriptions.length > 0 && (
            <Section style={subscriptionDetails}>
              <Heading style={h2}>Active Subscriptions</Heading>
              {subscriptions.map((sub, index) => (
                <Text key={index} style={orderText}>
                  • <strong>{sub.name}:</strong> ${sub.amount.toFixed(2)}/{sub.frequency}
                </Text>
              ))}
            </Section>
          )}

          {/* QUESTIONNAIRE SECTION - REQUIRED */}
          <Section style={importantNote}>
            <Heading style={h2}>⚠️ Action Required: Complete Your Questionnaire</Heading>
            <Text style={importantText}>
              <strong>Your LLC formation cannot proceed until you complete the questionnaire.</strong> This is a required step that collects the information we need to prepare your formation documents, including EIN application and Operating Agreement.
            </Text>
          </Section>

          <Text style={text}>
            The questionnaire link has been sent in this email and is also available in your dashboard. You can save your progress and return to complete it later if needed.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={`${baseUrl}/en/questionnaire/${orderId}${questionnaireToken ? `?t=${encodeURIComponent(questionnaireToken)}` : ''}`}>
              Complete Questionnaire Now
            </Button>
          </Section>

          <Hr style={hr} />
          
          <Section style={nextSteps}>
            <Heading style={h2}>What Happens Next?</Heading>
            <Text style={stepText}>
              <strong>1. Complete Questionnaire (Required)</strong> - Fill out the questionnaire to provide necessary information for your LLC formation
            </Text>
            <Text style={stepText}>
              <strong>2. Name Verification</strong> - We'll verify your LLC name availability (1-2 business days)
            </Text>
            <Text style={stepText}>
              <strong>3. Articles Filing</strong> - We'll file your Articles of Organization with your selected state (2-3 business days)
            </Text>
            <Text style={stepText}>
              <strong>4. Document Preparation</strong> - Your EIN, Operating Agreement, and other documents will be prepared
            </Text>
            <Text style={stepText}>
              <strong>5. Completion</strong> - All documents delivered within 7-10 business days
            </Text>
          </Section>
          
          {/* Dashboard Link */}
          <Section style={buttonContainer}>
            <Button style={button} href={`${baseUrl}/en/dashboard${token ? `?t=${encodeURIComponent(token)}` : ''}`}>
              Access Your Dashboard
            </Button>
          </Section>
          
          <Hr style={hr} />
          
          <Text style={footer}>
            Questions? Reply to this email or contact us at support@fabiel.net<br/>
            <br/>
            <strong>Important:</strong> Complete the questionnaire within 7 days to avoid delays in your LLC formation process.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// Legacy email for backward compatibility (now just calls OrderConfirmationEmail)
export const LLCConfirmationEmail = OrderConfirmationEmail;

export const SubscriptionConfirmationEmail = ({ _email, customerName, serviceName, amount, frequency, subscriptionId, companyName }: { _email: string; customerName: string; serviceName: string; amount: number; frequency: string; subscriptionId: string; companyName: string }) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Img
            src={`${baseUrl}/logo.png`}
            width="150"
            height="50"
            alt="Fabiel.net"
            style={logo}
          />
        </Section>
        
        <Section style={content}>
          <Heading style={h1}>{serviceName} Activated! ✅</Heading>
          
          <Text style={text}>
            Dear {customerName},
          </Text>
          
          <Text style={text}>
            Great news! Your {serviceName} subscription for {companyName} LLC has been successfully activated.
          </Text>
          
          <Section style={subscriptionDetails}>
            <Heading style={h2}>Subscription Details</Heading>
            <Text style={orderText}>
              <strong>Service:</strong> {serviceName}<br/>
              <strong>Amount:</strong> ${amount.toFixed(2)} / {frequency}<br/>
              <strong>Subscription ID:</strong> {subscriptionId}<br/>
              <strong>Next Billing:</strong> {frequency === 'monthly' ? '30 days' : '1 year'} from today
            </Text>
          </Section>
          
          <Section style={buttonContainer}>
            <Button style={button} href={`${baseUrl}/dashboard/subscriptions`}>
              Manage Subscription
            </Button>
          </Section>
          
          <Hr style={hr} />
          
          <Text style={footer}>
            You can cancel or modify your subscription anytime from your dashboard.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export const SubscriptionFailureEmail = ({ _email, customerName, serviceName, companyName, error }: { _email: string; customerName: string; serviceName: string; companyName: string; error: string }) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Img
            src={`${baseUrl}/logo.png`}
            width="150"
            height="50"
            alt="Fabiel.net"
            style={logo}
          />
        </Section>
        
        <Section style={content}>
          <Heading style={h1}>Action Required - Subscription Setup</Heading>
          
          <Text style={text}>
            Dear {customerName},
          </Text>
          
          <Text style={text}>
            We encountered an issue setting up your {serviceName} subscription for {companyName} LLC.
          </Text>
          
          <Section style={errorDetails}>
            <Heading style={h2}>What Happened?</Heading>
            <Text style={errorText}>
              {error.includes('payment') 
                ? 'Your payment method could not be charged. This may be due to insufficient funds, an expired card, or your bank declining the transaction.'
                : 'There was a technical issue with your subscription setup. Our team has been notified and will resolve this quickly.'
              }
            </Text>
          </Section>
          
          <Section style={buttonContainer}>
            <Button style={button} href={`${baseUrl}/dashboard/billing`}>
              Update Payment Method
            </Button>
          </Section>
          
          <Hr style={hr} />
          
          <Text style={footer}>
            Don't worry - your main LLC formation is not affected. Contact us at support@fabiel.net if you need help.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export const QuestionnaireEmail = ({ _email, customerName, companyName, orderId, questionnaires, token }: { _email: string; customerName: string; companyName: string; orderId: string; questionnaires: string[]; token?: string }) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Img
            src={`${baseUrl}/logo.png`}
            width="150"
            height="50"
            alt="Fabiel.net"
            style={logo}
          />
        </Section>

        <Section style={content}>
          <Heading style={h1}>Action Required: Complete Your Questionnaire 📋</Heading>

          <Text style={text}>
            Dear {customerName},
          </Text>

          <Text style={text}>
            Thank you for your order! <strong>To proceed with your {companyName} LLC formation, you must complete the questionnaire.</strong> This is a required step that allows us to gather the information needed to prepare your formation documents.
          </Text>

          <Section style={importantNote}>
            <Text style={importantText}>
              <strong>Important:</strong> Your LLC formation cannot proceed until the questionnaire is completed. Please complete it as soon as possible to avoid delays.
            </Text>
          </Section>

          <Text style={text}>
            The questionnaire covers the following sections:
          </Text>

          <Section style={questionnaireList}>
            {questionnaires.map((questionnaire, index) => (
              <Text key={index} style={listItem}>
                • {questionnaire}
              </Text>
            ))}
          </Section>

          <Text style={text}>
            Click the button below to access your questionnaire. You can save your progress and return to complete it later if needed.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={`${baseUrl}/en/questionnaire/${orderId}${token ? `?t=${encodeURIComponent(token)}` : ''}`}>
              Complete Questionnaire Now
            </Button>
          </Section>

          <Text style={text}>
            <strong>Having trouble?</strong> If the button above doesn&apos;t work, copy and paste this link into your browser:
          </Text>
          <Text style={linkText}>
            {`${baseUrl}/en/questionnaire/${orderId}${token ? `?t=${encodeURIComponent(token)}` : ''}`}
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            Complete within 7 days to avoid delays in your LLC formation process.<br /><br />
            Need help? Contact our support team at <a href="mailto:support@fabiel.net" style={linkStyle}>support@fabiel.net</a>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// Subscription cancellation notification
export const SubscriptionCancellationEmail = ({ _email, customerName, serviceName, companyName, state, serviceEndDate, isRegisteredAgent, isCompliancePackage, cancellationReason, stateFileNumber }: { _email: string; customerName: string; serviceName: string; companyName: string; state: string; serviceEndDate: Date; isRegisteredAgent: boolean; isCompliancePackage: boolean; cancellationReason?: string; stateFileNumber?: string }) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Img src={`${baseUrl}/logo.png`} width="150" height="50" alt="Fabiel.net" style={logo} />
        </Section>

        <Section style={content}>
          <Heading style={h1}>Subscription Cancellation Confirmed</Heading>

          <Text style={text}>Dear {customerName},</Text>

          <Text style={text}>
            Your subscription for <strong>{serviceName}</strong> under <strong>{companyName}</strong> has been cancelled.
          </Text>

          <Section style={orderDetails}>
            <Text style={orderText}>
              <strong>State:</strong> {state}<br/>
              <strong>Service End Date:</strong> {new Date(serviceEndDate).toLocaleDateString()}<br/>
              {stateFileNumber ? (<><strong>State File #:</strong> {stateFileNumber}<br/></>) : null}
            </Text>
          </Section>

          {cancellationReason && (
            <Section style={importantNote}>
              <Text style={importantText}><strong>Reason:</strong> {cancellationReason}</Text>
            </Section>
          )}

          <Text style={footer}>
            If you need help or want to re-activate this service, reply to this email or contact support@fabiel.net.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// Order cancellation with refund breakdown
export const OrderCancellationEmail = ({ _email, customerName, companyName, orderId, state, refundBreakdown, cancellationReason }: { _email: string; customerName: string; companyName: string; orderId: string; state: string; refundBreakdown: { serviceFee: number; processingFeeDeducted: number; stateFees: number; stateFeesRefundable: boolean; totalRefund: number }; cancellationReason?: string }) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Img src={`${baseUrl}/logo.png`} width="150" height="50" alt="Fabiel.net" style={logo} />
        </Section>

        <Section style={content}>
          <Heading style={h1}>Order Cancellation and Refund</Heading>

          <Text style={text}>Dear {customerName},</Text>

          <Text style={text}>
            Your order <strong>#{orderId}</strong> for <strong>{companyName}</strong> has been cancelled.
          </Text>

          <Section style={orderDetails}>
            <Heading style={h2}>Refund Breakdown</Heading>
            <Text style={orderText}>
              <strong>Service Fee:</strong> ${refundBreakdown.serviceFee.toFixed(2)}<br/>
              <strong>Processing Fee Deducted:</strong> ${refundBreakdown.processingFeeDeducted.toFixed(2)}<br/>
              <strong>State Fees:</strong> ${refundBreakdown.stateFees.toFixed(2)} ({refundBreakdown.stateFeesRefundable ? 'Refundable' : 'Non-refundable'})<br/>
              <strong>Total Refund:</strong> ${refundBreakdown.totalRefund.toFixed(2)}
            </Text>
          </Section>

          {cancellationReason && (
            <Section style={importantNote}>
              <Text style={importantText}><strong>Reason:</strong> {cancellationReason}</Text>
            </Section>
          )}

          <Text style={footer}>
            Refunds typically process within 5-10 business days. If you have questions, reply to this email or contact support@fabiel.net.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// Email Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const header = {
  padding: '20px 40px',
  backgroundColor: '#f59e0b',
};

const logo = {
  margin: '0 auto',
};

const content = {
  padding: '40px',
};

const h1 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '30px 0',
  padding: '0',
  lineHeight: '42px',
};

const h2 = {
  color: '#374151',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '20px 0 10px',
};

const text = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
};

const orderDetails = {
  backgroundColor: '#fef3c7',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
};

const subscriptionDetails = {
  backgroundColor: '#ecfdf5',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
};

const errorDetails = {
  backgroundColor: '#fef2f2',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
};

const nextSteps = {
  margin: '30px 0',
};

const questionnaireList = {
  backgroundColor: '#f3f4f6',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
};

const packageSection = {
  backgroundColor: '#eff6ff',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
  borderLeft: '4px solid #3b82f6',
};

const packageItem = {
  color: '#1e40af',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '4px 0',
};

const importantNote = {
  backgroundColor: '#fef3c7',
  padding: '16px',
  borderRadius: '8px',
  margin: '20px 0',
  borderLeft: '4px solid #f59e0b',
};

const importantText = {
  ...text,
  margin: '0',
  color: '#92400e',
};

const linkText = {
  ...text,
  fontSize: '14px',
  color: '#6b7280',
  wordBreak: 'break-all' as const,
};

const linkStyle = {
  color: '#f59e0b',
  textDecoration: 'underline',
};

const orderText = {
  ...text,
  margin: '0',
};

const stepText = {
  ...text,
  margin: '8px 0',
};

const errorText = {
  ...text,
  color: '#dc2626',
  margin: '0',
};

const listItem = {
  ...text,
  margin: '4px 0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#f59e0b',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  margin: '0 auto',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '30px 0',
};

const footer = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '24px',
  textAlign: 'center' as const,
};