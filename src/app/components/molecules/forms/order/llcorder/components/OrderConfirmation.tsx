import { LLCFormData } from '../types';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CheckCircleIcon, DocumentTextIcon, EnvelopeIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/app/components/providers/AuthProvider';

interface OrderConfirmationProps {
  formData: LLCFormData;
  orderTotal: number;
  orderId: string;
  updateFormData: (field: keyof LLCFormData, value: any) => void;
  scrollToError: (fieldName: string) => void;
  onSubmit: () => void;
  onPrev: () => void;
}

interface ServiceBreakdown {
  oneTimeServices: Array<{ name: string; price: number; status: 'paid' | 'pending' }>;
  yearlyServices: Array<{ name: string; price: number; status: 'paid' | 'pending' }>;
  monthlyServices: Array<{ name: string; price: number; status: 'paid' | 'pending' }>;
}

const OrderConfirmation = ({ formData, orderId }: OrderConfirmationProps) => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);
  const [emailSent, setEmailSent] = useState(false);
  const [savedToDatabase, setSavedToDatabase] = useState(false);
  const [questionnaireEmailSent, setQuestionnaireEmailSent] = useState(false);
  const [subscriptionsProcessed, setSubscriptionsProcessed] = useState(false);
  const [questionnaireToken, setQuestionnaireToken] = useState<string | null>(null);
  const { locale } = useParams<{ locale: string }>();
  
  // Use verified email (from Google/account login) as priority over form email
  const recipientEmail = user?.email || formData.email;

  // Calculate service breakdown
  const getServiceBreakdown = (): ServiceBreakdown => {
    const oneTimeServices: Array<{ name: string; price: number; status: 'paid' | 'pending' }> = [
      { name: 'LLC Formation Package', price: 124.99, status: 'paid' }
    ];

    const yearlyServices: Array<{ name: string; price: number; status: 'paid' | 'pending' }> = [];
    if (formData.registeredAgent) {
      yearlyServices.push({ name: 'Registered Agent Service', price: 149.00, status: 'pending' });
    }
    if (formData.compliance) {
      yearlyServices.push({ name: 'Compliance Service', price: 99.00, status: 'pending' });
    }

    const monthlyServices: Array<{ name: string; price: number; status: 'paid' | 'pending' }> = [];
    
    // Website tier pricing with 25% discount when registered agent or compliance is selected
    const hasWebDiscount = formData.registeredAgent || formData.compliance;
    
    if (formData.website === 'essential') {
      const basePrice = 29.99;
      const finalPrice = hasWebDiscount ? basePrice * 0.75 : basePrice;
      monthlyServices.push({ 
        name: hasWebDiscount ? 'Essential Website (25% off)' : 'Essential Website', 
        price: Number(finalPrice.toFixed(2)), 
        status: 'pending' 
      });
    } else if (formData.website === 'professional') {
      const basePrice = 49.99;
      const finalPrice = hasWebDiscount ? basePrice * 0.75 : basePrice;
      monthlyServices.push({ 
        name: hasWebDiscount ? 'Professional Website (25% off)' : 'Professional Website', 
        price: Number(finalPrice.toFixed(2)), 
        status: 'pending' 
      });
    }
    
    // Blog Pro pricing (independent add-on) with 25% discount
    if (formData.blogPro) {
      const basePrice = 49.99;
      const finalPrice = hasWebDiscount ? basePrice * 0.75 : basePrice;
      monthlyServices.push({ 
        name: hasWebDiscount ? 'Blog Pro (25% off)' : 'Blog Pro', 
        price: Number(finalPrice.toFixed(2)), 
        status: 'pending' 
      });
    }

    return { oneTimeServices, yearlyServices, monthlyServices };
  };

  const serviceBreakdown = getServiceBreakdown();

  const ranRef = useRef(false);
  useEffect(() => {
    if (ranRef.current) return; // prevent double-run in React Strict Mode (dev)
    ranRef.current = true;
    // Process order and handle payment flow
    const processOrder = async () => {
      try {
        // Step 1: Save main order to database
        await saveOrderToDatabase();
        setSavedToDatabase(true);

        // Step 2: Send initial confirmation email (also sends questionnaire link)
        await sendConfirmationEmail();
        setEmailSent(true);
        setQuestionnaireEmailSent(true);

        // Step 4: Process subscription services
        if (serviceBreakdown.yearlyServices.length > 0 || serviceBreakdown.monthlyServices.length > 0) {
          await processSubscriptions();
          setSubscriptionsProcessed(true);
        }

        setIsProcessing(false);

        // Redirect to dashboard after completion
        if (formData.email && formData.password) {
          setTimeout(() => {
            redirectToDashboard();
          }, 8000);
        }
      } catch (error) {
        console.error('Error processing order:', error);
        setIsProcessing(false);
      }
    };

    processOrder();
  }, []);

  const saveOrderToDatabase = async () => {
    const totalAmount = serviceBreakdown.oneTimeServices.reduce((sum, service) => sum + service.price, 0);
    
    // Map website tier to database enum (BASIC, PRO, GROWTH)
    // Note: blogPro uses GROWTH tier. If both tier + blogPro selected, we use PRO (highest tier)
    let websiteService: string | null = null;
    if (formData.website === 'essential') {
      websiteService = 'BASIC';
    } else if (formData.website === 'professional') {
      websiteService = 'PRO';
    }
    
    // If Blog Pro selected (with or without a tier), use GROWTH or keep PRO if already selected
    if (formData.blogPro) {
      if (!websiteService) {
        websiteService = 'GROWTH';  // Blog Pro standalone
      }
      // If PRO already selected, keep it (PRO includes more features)
      // If BASIC selected with Blog Pro, upgrade to PRO
      if (websiteService === 'BASIC') {
        websiteService = 'PRO';
      }
    }
    
    const stateCode = formData.formationState || 'CA';
    const payload = {
      orderId,
      companyName: formData.companyName,
      businessAddress: formData.businessAddress,
      businessCity: formData.businessCity,
      businessState: stateCode,
      businessZip: formData.businessZip,
      businessPurpose: formData.businessPurpose,
      contactFirstName: formData.firstName,
      contactLastName: formData.lastName,
      contactEmail: recipientEmail, // Use verified email (Gmail/account) over form email
      contactPhone: formData.phone,
      needEIN: true,
      needOperatingAgreement: true,
      needBankLetter: true,
      registeredAgent: !!formData.registeredAgent,
      compliance: !!formData.compliance,
      websiteService,
      totalAmount,
      formationState: stateCode, // Also send formation state
    };

    try {
      const res = await fetch('/api/orders/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({} as any));
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to save order');
      }
      // Get questionnaire token from order save response
      if (data?.questionnaireToken) {
        setQuestionnaireToken(data.questionnaireToken);
      }
      console.log('Order saved, questionnaire token:', data?.questionnaireToken);
    } catch (e) {
      console.error('Order save failed (continuing):', e);
    }
  };

  const sendConfirmationEmail = async () => {
    const totalAmount = serviceBreakdown.oneTimeServices.reduce((sum, service) => sum + service.price, 0);
    
    // Use verified email (Gmail/account) over form email
    const emailToSend = recipientEmail;
    
    // Construct full company name with LLC designation
    const fullCompanyName = `${formData.companyName} ${formData.llcSuffix || 'LLC'}`;
    
    // Check for discount eligibility
    const hasWebDiscount = formData.registeredAgent || formData.compliance;
    
    console.log('[OrderConfirmation] Sending email to:', emailToSend, '(user:', user?.email, ', form:', formData.email, ')');
    
    const payload = {
      orderId,
      email: emailToSend,
      companyName: fullCompanyName,
      customerName: `${formData.firstName} ${formData.lastName}`,
      totalAmount,
      // Pass all service selections for accurate email summary
      websiteTier: formData.website, // 'essential' | 'professional' | null
      blogPro: formData.blogPro,
      registeredAgent: formData.registeredAgent,
      compliance: formData.compliance,
      hasWebDiscount,
    };

    try {
      const res = await fetch('/api/send-confirmation-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Email send failed');
      }
      const data = await res.json().catch(() => ({} as any));
      if (data?.token) setQuestionnaireToken(data.token);
      console.log('Confirmation + questionnaire emails requested.');
    } catch (e) {
      console.error('Failed to send emails:', e);
    }
  };

  const processSubscriptions = async () => {
    // Process yearly subscriptions
    for (const service of serviceBreakdown.yearlyServices) {
      console.log(`Processing yearly subscription: ${service.name}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Send individual confirmation emails for each subscription
    }

    // Process monthly subscriptions
    for (const service of serviceBreakdown.monthlyServices) {
      console.log(`Processing monthly subscription: ${service.name}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Send individual confirmation emails for each subscription
    }
  };

  const redirectToDashboard = () => {
    console.log('Redirecting to dashboard...');
    // window.location.href = '/dashboard';
  };

  if (isProcessing) {
    return (
      <div className="space-y-8 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto"></div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Your Order</h2>
          <p className="text-gray-600">Setting up your LLC formation and additional services...</p>
        </div>
        
        {/* Processing Steps */}
        <div className="max-w-md mx-auto space-y-3">
          <div className={`flex items-center text-sm p-3 rounded-lg ${
            savedToDatabase ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'
          }`}>
            <div className={`w-4 h-4 rounded-full mr-3 ${
              savedToDatabase ? 'bg-green-500' : 'bg-gray-300'
            }`}></div>
            Order recorded
          </div>
          
          <div className={`flex items-center text-sm p-3 rounded-lg ${
            emailSent ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'
          }`}>
            <div className={`w-4 h-4 rounded-full mr-3 ${
              emailSent ? 'bg-green-500' : 'bg-gray-300'
            }`}></div>
            Confirmation email sent
          </div>
          
          <div className={`flex items-center text-sm p-3 rounded-lg ${
            questionnaireEmailSent ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'
          }`}>
            <div className={`w-4 h-4 rounded-full mr-3 ${
              questionnaireEmailSent ? 'bg-green-500' : 'bg-gray-300'
            }`}></div>
            Questionnaire link sent
          </div>
          
          {(serviceBreakdown.yearlyServices.length > 0 || serviceBreakdown.monthlyServices.length > 0) && (
            <div className={`flex items-center text-sm p-3 rounded-lg ${
              subscriptionsProcessed ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'
            }`}>
              <div className={`w-4 h-4 rounded-full mr-3 ${
                subscriptionsProcessed ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
              Subscription services activated
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Success Header */}
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <CheckCircleIcon className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Complete!</h2>
        <p className="text-lg text-gray-600">Your LLC formation and services are now being processed</p>
        <div className="mt-4 inline-block bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
          <span className="text-sm font-medium text-amber-800">Order ID: </span>
          <span className="text-sm font-mono font-bold text-amber-900">{orderId}</span>
        </div>
      </div>

      {/* LLC Formation Services Breakdown */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <DocumentTextIcon className="h-5 w-5 mr-2" />
          LLC Formation Services Breakdown
        </h3>
        
        <div className="space-y-6">
          {/* One-time Services */}
          <div>
            <h4 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
              <CreditCardIcon className="h-4 w-4 mr-2 text-green-600" />
              One-time Services (Paid Today)
            </h4>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              {serviceBreakdown.oneTimeServices.map((service, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-gray-900">{service.name}</span>
                  </div>
                  <span className="font-semibold text-green-700">${service.price.toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-green-200 mt-3 pt-3">
                <div className="flex justify-between items-center font-bold text-green-800">
                  <span>Total Paid Today</span>
                  <span>${serviceBreakdown.oneTimeServices.reduce((sum, s) => sum + s.price, 0).toFixed(2)}</span>
                </div>
              </div>
              
              {/* Package Items Included */}
              <div className="border-t border-green-200 mt-3 pt-3">
                <p className="text-sm font-semibold text-green-700 mb-2">Your Package Includes:</p>
                <ul className="text-sm text-green-700 space-y-1">
                  <li className="flex items-center"><CheckCircleIcon className="h-3 w-3 mr-2" /> LLC Formation & State Filing</li>
                  <li className="flex items-center"><CheckCircleIcon className="h-3 w-3 mr-2" /> EIN Application</li>
                  <li className="flex items-center"><CheckCircleIcon className="h-3 w-3 mr-2" /> Operating Agreement</li>
                  <li className="flex items-center"><CheckCircleIcon className="h-3 w-3 mr-2" /> Bank Resolution Letter</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Yearly Services */}
          {serviceBreakdown.yearlyServices.length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                <CreditCardIcon className="h-4 w-4 mr-2 text-amber-600" />
                Yearly Subscriptions (Billed Annually)
              </h4>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                {serviceBreakdown.yearlyServices.map((service, index) => (
                  <div key={index} className="flex justify-between items-center mb-2 last:mb-0">
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-4 w-4 text-amber-600 mr-2" />
                      <span className="text-gray-900">{service.name}</span>
                    </div>
                    <span className="font-semibold text-amber-700">${service.price}/year</span>
                  </div>
                ))}
                <div className="text-xs text-amber-700 mt-3 p-2 bg-amber-100 rounded">
                  <strong>Billing Note:</strong> These services are billed annually. First payment will be charged separately and you'll receive individual confirmation emails.
                </div>
              </div>
            </div>
          )}

          {/* Monthly Services */}
          {serviceBreakdown.monthlyServices.length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                <CreditCardIcon className="h-4 w-4 mr-2 text-blue-600" />
                Monthly Subscriptions (Billed Monthly)
              </h4>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                {serviceBreakdown.monthlyServices.map((service, index) => (
                  <div key={index} className="flex justify-between items-center mb-2 last:mb-0">
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-gray-900">{service.name}</span>
                    </div>
                    <span className="font-semibold text-blue-700">${service.price}/month</span>
                  </div>
                ))}
                <div className="text-xs text-blue-700 mt-3 p-2 bg-blue-100 rounded">
                  <strong>Billing Note:</strong> These services are billed monthly. First payment will be charged separately and you'll receive individual confirmation emails.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Updates */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <EnvelopeIcon className="h-5 w-5 mr-2 text-green-600" />
            <span className="font-medium text-green-800">Confirmation Email Sent</span>
          </div>
          <p className="text-sm text-green-700">
            Check your inbox for order confirmation and receipt.
          </p>
        </div>
        
        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-5">
          <div className="flex items-center mb-3">
            <DocumentTextIcon className="h-6 w-6 mr-2 text-blue-600" />
            <span className="font-semibold text-blue-800 text-lg">Action Required: Complete Questionnaire</span>
          </div>
          <p className="text-sm text-blue-700 mb-3">
            <strong>Your LLC formation cannot proceed until you complete the questionnaire.</strong> This form collects the information we need to prepare your formation documents, including EIN application, Operating Agreement, and other services.
          </p>
          <p className="text-xs text-blue-600 mb-4">
            The questionnaire link has been sent to your order confirmation email and is also available in your dashboard. Need help? Contact us at <a href="mailto:support@fabiel.net" className="underline font-medium">support@fabiel.net</a>
          </p>
          
          {/* Always show button - with or without token */}
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            {questionnaireToken ? (
              <Link
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-base shadow-md transition-all"
                href={`/${locale || 'en'}/questionnaire/${orderId}?t=${encodeURIComponent(questionnaireToken)}`}
              >
                <DocumentTextIcon className="h-5 w-5 mr-2" />
                Start Questionnaire Now
              </Link>
            ) : (
              <Link
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-base shadow-md transition-all"
                href={`/${locale || 'en'}/dashboard`}
              >
                <DocumentTextIcon className="h-5 w-5 mr-2" />
                Go to Dashboard to Start Questionnaire
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Important Information */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
        <h4 className="font-semibold text-amber-800 mb-3 text-lg">Next Steps & Important Information</h4>
        <div className="text-amber-700 space-y-3">
          <div className="flex items-start bg-amber-100 p-3 rounded-lg border-l-4 border-amber-500">
            <span className="font-semibold mr-2">1.</span>
            <div>
              <strong>Complete Questionnaire (Required):</strong> You must complete the questionnaire to proceed with your LLC formation. Click the &quot;Start Questionnaire Now&quot; button above or use the link sent to your email. This step is mandatory.
            </div>
          </div>
          <div className="flex items-start">
            <span className="font-semibold mr-2">2.</span>
            <div>
              <strong>LLC Formation Processing:</strong> Once the questionnaire is complete, we&apos;ll verify your name availability and file your Articles of Organization within 2-3 business days.
            </div>
          </div>
          <div className="flex items-start">
            <span className="font-semibold mr-2">3.</span>
            <div>
              <strong>Subscription Services:</strong> Recurring services will be processed after LLC approval and you&apos;ll receive separate confirmation emails for each.
            </div>
          </div>
          <div className="flex items-start">
            <span className="font-semibold mr-2">4.</span>
            <div>
              <strong>Document Delivery:</strong> All completed documents will be available in your client dashboard within 7-10 business days.
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Access */}
      {formData.email && formData.password ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <h4 className="font-semibold text-green-800 mb-2">Client Dashboard Access</h4>
          <p className="text-green-700 mb-4">
            Your account has been created! Access your dashboard to track progress and complete questionnaires.
          </p>
          <button 
            onClick={redirectToDashboard}
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Access Your Dashboard
          </button>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <h4 className="font-semibold text-gray-800 mb-2">Track Your Order</h4>
          <p className="text-gray-700 mb-3">
            We'll send you a special link to track your order progress and complete questionnaires without creating an account.
          </p>
          <p className="text-sm text-gray-600">
            Check your email at <strong>{formData.email}</strong> for the tracking link.
          </p>
        </div>
      )}

      {/* Support Information */}
      <div className="text-center text-gray-600 text-sm border-t border-gray-200 pt-6">
        <p className="mb-2">Questions about your order? Contact our support team:</p>
        <p>
          <strong>Email:</strong> support@fabiel.net | 
          <strong> Phone:</strong> (555) 123-4567 | 
          <strong> Order ID:</strong> {orderId}
        </p>
      </div>
    </div>
  );
};

export default OrderConfirmation;