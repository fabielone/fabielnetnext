import { LLCFormData } from '../types';
import { useEffect, useState } from 'react';
import { CheckCircleIcon, DocumentTextIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

interface OrderConfirmationProps {
  formData: LLCFormData;
  orderTotal: number;
  orderId: string;
  updateFormData: (field: keyof LLCFormData, value: any) => void;
  scrollToError: (fieldName: string) => void;
  onSubmit: () => void;
  onPrev: () => void;
}

const OrderConfirmation = ({ formData, orderTotal, orderId, updateFormData, scrollToError }: OrderConfirmationProps) => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [emailSent, setEmailSent] = useState(false);
  const [savedToDatabase, setSavedToDatabase] = useState(false);

  useEffect(() => {
    // Simulate processing order and saving to database
    const processOrder = async () => {
      try {
        // Save order to database
        await saveOrderToDatabase();
        setSavedToDatabase(true);

        // Send confirmation email
        await sendConfirmationEmail();
        setEmailSent(true);

        setIsProcessing(false);

        // Redirect to dashboard after 5 seconds if user created account
        if (formData.email && formData.password) {
          setTimeout(() => {
            redirectToDashboard();
          }, 5000);
        }
      } catch (error) {
        console.error('Error processing order:', error);
        setIsProcessing(false);
      }
    };

    processOrder();
  }, []);

  const saveOrderToDatabase = async () => {
    // This will save the order data to your database
    const orderData = {
      orderId,
      ...formData,
      orderTotal,
      status: 'pending_name_approval',
      createdAt: new Date().toISOString(),
      paymentStatus: 'completed'
    };

    // TODO: Replace with actual API call
    console.log('Saving order to database:', orderData);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const sendConfirmationEmail = async () => {
    const emailData = {
      to: formData.email,
      orderId,
      companyName: formData.companyName,
      orderTotal,
      services: {
        registeredAgent: formData.registeredAgent,
        compliance: formData.compliance,
        website: formData.website
      }
    };

    // TODO: Replace with actual email service call
    console.log('Sending confirmation email:', emailData);
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 800));
  };

  const redirectToDashboard = () => {
    // TODO: Replace with actual navigation
    console.log('Redirecting to dashboard...');
    // window.location.href = '/dashboard';
  };

  if (isProcessing) {
    return (
      <div className="space-y-8 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto"></div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Your Order</h2>
          <p className="text-gray-600">Please wait while we finalize your LLC formation...</p>
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
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
        <p className="text-lg text-gray-600">Your LLC formation is now in progress</p>
        <div className="mt-4 inline-block bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
          <span className="text-sm font-medium text-amber-800">Order ID: </span>
          <span className="text-sm font-mono font-bold text-amber-900">{orderId}</span>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <DocumentTextIcon className="h-5 w-5 mr-2" />
          Order Summary
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Company Name</span>
              <p className="text-lg font-semibold text-gray-900">{formData.companyName} LLC</p>
            </div>
            
            <div>
              <span className="text-sm font-medium text-gray-500">Business Address</span>
              <p className="text-gray-900">
                {formData.businessAddress}<br />
                {formData.businessCity}, CA {formData.businessZip}
              </p>
            </div>

            <div>
              <span className="text-sm font-medium text-gray-500">Business Purpose</span>
              <p className="text-gray-900">{formData.businessPurpose}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Services Selected</span>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>LLC Formation (Base)</span>
                  <span className="font-medium">$124.99</span>
                </div>
                {formData.registeredAgent && (
                  <div className="flex justify-between text-sm">
                    <span>Registered Agent Service</span>
                    <span className="font-medium">$149.00</span>
                  </div>
                )}
                {formData.compliance && (
                  <div className="flex justify-between text-sm">
                    <span>Compliance Package</span>
                    <span className="font-medium">$99.00</span>
                  </div>
                )}
                {formData.website && (
                  <div className="flex justify-between text-sm">
                    <span>Business Website</span>
                    <span className="font-medium">$299.00</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-2 mt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Paid</span>
                    <span className="text-green-600">${orderTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Updates */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className={`border rounded-lg p-4 ${emailSent ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center">
            <EnvelopeIcon className={`h-5 w-5 mr-2 ${emailSent ? 'text-green-600' : 'text-gray-400'}`} />
            <span className={`font-medium ${emailSent ? 'text-green-800' : 'text-gray-600'}`}>
              {emailSent ? 'Confirmation Email Sent' : 'Sending Confirmation Email...'}
            </span>
          </div>
        </div>
        
        <div className={`border rounded-lg p-4 ${savedToDatabase ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center">
            <DocumentTextIcon className={`h-5 w-5 mr-2 ${savedToDatabase ? 'text-green-600' : 'text-gray-400'}`} />
            <span className={`font-medium ${savedToDatabase ? 'text-green-800' : 'text-gray-600'}`}>
              {savedToDatabase ? 'Order Recorded' : 'Recording Order...'}
            </span>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-800 mb-3 text-lg">Important Notice</h4>
        <div className="text-blue-700 space-y-2">
          <p>
            <strong>Name Approval:</strong> The State of California will have the final word on your LLC name approval. 
            If your chosen name is unavailable, we'll contact you with alternative options.
          </p>
          <p>
            <strong>Processing Time:</strong> Your LLC formation will be processed within 5-7 business days after name approval.
          </p>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
        <h4 className="font-semibold text-amber-800 mb-3 text-lg">What Happens Next?</h4>
        <ol className="list-decimal list-inside text-amber-700 space-y-2">
          <li>We'll verify your LLC name availability with the California Secretary of State (1-2 business days)</li>
          <li>Articles of Organization will be filed with the state</li>
          <li>We'll obtain your Federal EIN (Tax ID Number)</li>
          <li>You'll receive your completed documents and certificates via email</li>
          {formData.registeredAgent && <li>Your registered agent service will be activated</li>}
          {formData.compliance && <li>Your compliance package will be set up</li>}
          {formData.website && <li>Your business website development will begin</li>}
        </ol>
      </div>

      {/* Dashboard or Email Notice */}
      {formData.email && formData.password ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <h4 className="font-semibold text-green-800 mb-2">Account Created Successfully!</h4>
          <p className="text-green-700 mb-4">
            You'll be redirected to your dashboard in a few seconds where you can track your order progress.
          </p>
          <button 
            onClick={redirectToDashboard}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Go to Dashboard Now
          </button>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <h4 className="font-semibold text-gray-800 mb-2">Stay Updated</h4>
          <p className="text-gray-700">
            We'll send you email updates throughout the formation process. 
            Please keep an eye on your inbox at <strong>{formData.email}</strong>
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