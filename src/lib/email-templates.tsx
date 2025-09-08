
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

export const LLCConfirmationEmail = ({ _email, companyName, customerName, orderId, totalAmount, token }: { _email: string; companyName: string; customerName: string; orderId: string; totalAmount: number; token?: string }) => (
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
          <Heading style={h1}>LLC Formation Confirmed! 🎉</Heading>
          
          <Text style={text}>
            Dear {customerName},
          </Text>
          
          <Text style={text}>
            Thank you for choosing Fabiel.net for your California LLC formation. 
            Your order has been successfully received and payment processed.
          </Text>
          
          <Section style={orderDetails}>
            <Heading style={h2}>Order Details</Heading>
            <Text style={orderText}>
              <strong>Order ID:</strong> {orderId}<br/>
              <strong>Company Name:</strong> {companyName} LLC<br/>
              <strong>Amount Paid:</strong> ${totalAmount.toFixed(2)}<br/>
              <strong>Status:</strong> Processing
            </Text>
          </Section>
          
          <Section style={nextSteps}>
            <Heading style={h2}>What Happens Next?</Heading>
            <Text style={stepText}>
              <strong>1. Name Verification</strong> - We'll verify your LLC name availability (1-2 business days)
            </Text>
            <Text style={stepText}>
              <strong>2. Articles Filing</strong> - We'll file your Articles of Organization with California (2-3 business days)
            </Text>
            <Text style={stepText}>
              <strong>3. Document Preparation</strong> - Your EIN, Operating Agreement, and other documents will be prepared
            </Text>
            <Text style={stepText}>
              <strong>4. Completion</strong> - All documents delivered within 7-10 business days
            </Text>
          </Section>
          
          {/* Dashboard Link */}
          <Section style={buttonContainer}>
            <Button style={button} href={`${baseUrl}/en/dashboard${token ? `?t=${encodeURIComponent(token)}` : ''}`}>
              Track Your Order
            </Button>
          </Section>
          
          <Hr style={hr} />
          
          <Text style={footer}>
            Questions? Reply to this email or contact us at support@fabiel.net
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

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
          <Heading style={h1}>Complete Your LLC Setup 📋</Heading>
          
          <Text style={text}>
            Dear {customerName},
          </Text>
          
          <Text style={text}>
            To complete your {companyName} LLC formation, please fill out the following questionnaires:
          </Text>
          
          <Section style={questionnaireList}>
            {questionnaires.map((questionnaire, index) => (
              <Text key={index} style={listItem}>
                • {questionnaire}
              </Text>
            ))}
          </Section>
          
          <Text style={text}>
            These questionnaires help us customize your documents to your specific business needs.
          </Text>
          
          <Section style={buttonContainer}>
            <Button style={button} href={`${baseUrl}/en/questionnaire/${orderId}${token ? `?t=${encodeURIComponent(token)}` : ''}`}>
              Complete Questionnaires
            </Button>
          </Section>
          
          <Hr style={hr} />
          
          <Text style={footer}>
            Complete within 7 days to avoid delays in your LLC formation process.
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