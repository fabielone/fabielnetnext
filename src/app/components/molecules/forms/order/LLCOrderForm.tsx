'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { createClient } from '@supabase/supabase-js'
import { 
  CreditCardIcon, 
  CheckCircleIcon, 
  ArrowRightIcon, 
  ArrowLeftIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  UserIcon
} from '@heroicons/react/24/outline'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const LLCOrderForm = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Basic Info
    companyName: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Services
    registeredAgent: false,
    compliance: false,
    website: null,
    
    // Account
    password: '',
    confirmPassword: '',
    
    // LLC Details
    businessAddress: '',
    businessCity: '',
    businessZip: '',
    businessPurpose: '',
    managementType: '',
    numberOfMembers: '',
    einNeeded: true,
    operatingAgreement: true,
  })
  
  const [orderTotal, setOrderTotal] = useState(124.99)
  const [loading, setLoading] = useState(false)
  const [orderSubmitted, setOrderSubmitted] = useState(false)
  const [orderId, setOrderId] = useState('')

  const steps = [
    { id: 1, name: 'Basic Info', icon: UserIcon },
    { id: 2, name: 'Services', icon: BuildingOfficeIcon },
    { id: 3, name: 'Payment', icon: CreditCardIcon },
    { id: 4, name: 'Account', icon: ShieldCheckIcon },
    { id: 5, name: 'LLC Details', icon: GlobeAltIcon }
  ]

  // Calculate total whenever services change
  useEffect(() => {
    let total = 124.99 // Base price
    if (formData.registeredAgent) total += 149
    if (formData.compliance) total += 99
    setOrderTotal(total)
  }, [formData.registeredAgent, formData.compliance])

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 5))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return formData.companyName && formData.firstName && formData.lastName && 
               formData.email && formData.phone && validateEmail(formData.email)
      case 4:
        return formData.password && formData.confirmPassword && 
               formData.password === formData.confirmPassword && formData.password.length >= 8
      case 5:
        return formData.businessAddress && formData.businessCity && formData.businessZip && 
               formData.businessPurpose && formData.managementType && formData.numberOfMembers
      default:
        return true
    }
  }

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleServiceToggle = (service) => {
    updateFormData(service, !formData[service])
  }

  const handleWebsiteSelect = (websiteType) => {
    updateFormData('website', formData.website === websiteType ? null : websiteType)
  }

  // Stripe Payment Component with Payment Element
  const StripePaymentForm = () => {
    const stripe = useStripe()
    const elements = useElements()
    const [payError, setPayError] = useState<string | null>(null)

    const handleStripePayment = async (event) => {
      event.preventDefault()
      
      if (!stripe || !elements) return

      setLoading(true)
      
      try {
        // 1. Submit elements first - this validates the form and collects payment details
        const { error: submitError } = await elements.submit()
        if (submitError) {
          console.error('Elements submit error:', submitError)
          setPayError(submitError.message || 'Payment details incomplete')
          setLoading(false)
          return
        }

        // 2. Create PaymentIntent AFTER elements.submit()
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: Math.round(orderTotal * 100),
            customer: {
              email: formData.email,
              name: `${formData.firstName} ${formData.lastName}`,
              metadata: {
                companyName: formData.companyName,
                phone: formData.phone
              }
            },
            setup_future_usage: 'off_session'
          })
        })
        
        const { clientSecret } = await response.json()

        // 3. Confirm payment with the client secret
        const result = await stripe.confirmPayment({
          elements,
          clientSecret,
          confirmParams: {
            return_url: `${window.location.origin}/order-success`
          },
          redirect: 'if_required'
        })

        if (result.error) {
          console.error('Payment failed:', result.error)
          setPayError(result.error.message || 'Payment failed')
        } else {
          // Payment succeeded
          await handleOrderSubmission(result.paymentIntent.id)
          setPayError(null)
        }
      } catch (error) {
        console.error('Payment failed:', error)
        setPayError((error as any)?.message || 'Payment failed')
      } finally {
        setLoading(false)
      }
    }

    return (
      <form onSubmit={handleStripePayment} className="space-y-4">
        <div className="p-4 border border-gray-200 rounded-lg">
          <PaymentElement 
            options={{
              layout: 'tabs'
            }}
          />
        </div>
        {payError && (
          <div className="text-red-600 text-sm" role="alert">
            {payError}
          </div>
        )}
        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Processing...' : `Pay $${orderTotal.toFixed(2)}`}
        </button>
      </form>
    )
  }

  const handleOrderSubmission = async (paymentId) => {
    try {
      // Save order to Supabase
      const { data: order, error: orderError } = await supabase
        .from('llc_orders')
        .insert([{
          company_name: formData.companyName,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          business_address: formData.businessAddress,
          business_city: formData.businessCity,
          business_zip: formData.businessZip,
          business_purpose: formData.businessPurpose,
          management_type: formData.managementType,
          number_of_members: formData.numberOfMembers,
          registered_agent: formData.registeredAgent,
          compliance_service: formData.compliance,
          website_package: formData.website,
          ein_needed: formData.einNeeded,
          operating_agreement: formData.operatingAgreement,
          payment_id: paymentId,
          total_amount: orderTotal,
          status: 'paid'
        }])
        .select()

      if (orderError) throw orderError

      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone
          }
        }
      })

      if (authError) throw authError

      setOrderId(order[0].id)
      setOrderSubmitted(true)
      
      // Send confirmation email (Resend)
      await fetch('/api/send-confirmation-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order[0].id,
          email: formData.email,
          companyName: formData.companyName,
          customerName: `${formData.firstName} ${formData.lastName}`,
          totalAmount: orderTotal,
        })
      })

    } catch (error) {
      console.error('Order submission failed:', error)
    }
  }

  if (orderSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Your California LLC formation order has been successfully submitted.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Order ID: <span className="font-mono">{orderId}</span></p>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            You'll receive a confirmation email shortly with next steps.
          </p>
          <Link href={`/questionnaire/${orderId}`} className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg">
            Complete Questionnaire Now
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            California LLC Formation
          </h1>
          <p className="text-gray-600">Professional business formation by Fabiel.net</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  <step.icon className="w-5 h-5" />
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <span className="text-sm text-gray-500">
              Step {currentStep} of {steps.length}: {steps[currentStep - 1].name}
            </span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-lg font-semibold text-blue-900">$124.99 Total</div>
                  <div className="text-sm text-blue-700">$49.99 service fee + $75.00 state filing fee</div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Desired LLC Name *
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => updateFormData('companyName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your desired LLC name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => updateFormData('firstName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="First Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => updateFormData('lastName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Last Name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          )}

          {/* Step 2: Additional Services */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Additional Services</h2>
                <p className="text-gray-600">Enhance your LLC with professional services</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.registeredAgent 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleServiceToggle('registeredAgent')}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Registered Agent Service
                  </h3>
                  <div className="text-2xl font-bold text-blue-600 mb-2">$149/year</div>
                  <p className="text-gray-600">
                    Professional registered agent service for compliance requirements.
                  </p>
                </div>

                <div
                  className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.compliance 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleServiceToggle('compliance')}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Compliance Service
                  </h3>
                  <div className="text-2xl font-bold text-blue-600 mb-2">$99/year</div>
                  <p className="text-gray-600">
                    Annual compliance monitoring and filing reminders.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Website Services</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { type: 'basic', name: 'Basic Website', price: '$19.99/month', description: 'Professional website with up to 5 pages' },
                    { type: 'pro', name: 'Pro Website', price: '$49.99/month', description: 'Advanced website with unlimited pages and SEO' },
                    { type: 'ecommerce', name: 'E-commerce', price: '$49.99/month + commission', description: 'Full e-commerce solution with payments' }
                  ].map((website) => (
                    <div
                      key={website.type}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.website === website.type 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleWebsiteSelect(website.type)}
                    >
                      <h4 className="font-semibold text-gray-900 mb-2">{website.name}</h4>
                      <div className="text-lg font-bold text-blue-600 mb-2">{website.price}</div>
                      <p className="text-sm text-gray-600">{website.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xl font-bold text-gray-900">
                    Total: ${orderTotal.toFixed(2)}
                  </div>
                </div>
              </div>

              <Elements 
                stripe={stripePromise}
                options={{
                  mode: 'payment',
                  amount: Math.round(orderTotal * 100),
                  currency: 'usd',
                  // Must match server PaymentIntent setup_future_usage
                  setupFutureUsage: 'off_session',
                  appearance: {
                    theme: 'stripe',
                  },
                }}
              >
                <StripePaymentForm />
              </Elements>
            </div>
          )}

          {/* Step 4: Account Creation */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
                <p className="text-gray-600">Create an account to track your LLC formation</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Create Password *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateFormData('password', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter a secure password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm your password"
                />
              </div>
            </div>
          )}

          {/* Step 5: LLC Details */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">LLC Formation Details</h2>
                <p className="text-gray-600">Additional information required for filing</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Address *
                </label>
                <input
                  type="text"
                  value={formData.businessAddress}
                  onChange={(e) => updateFormData('businessAddress', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Street Address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.businessCity}
                    onChange={(e) => updateFormData('businessCity', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    value={formData.businessZip}
                    onChange={(e) => updateFormData('businessZip', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ZIP Code"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Purpose *
                </label>
                <textarea
                  value={formData.businessPurpose}
                  onChange={(e) => updateFormData('businessPurpose', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the purpose of your LLC"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Management Structure *
                  </label>
                  <select
                    value={formData.managementType}
                    onChange={(e) => updateFormData('managementType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select management type</option>
                    <option value="member">Member-managed</option>
                    <option value="manager">Manager-managed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Members *
                  </label>
                  <select
                    value={formData.numberOfMembers}
                    onChange={(e) => updateFormData('numberOfMembers', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select number of members</option>
                    <option value="1">Single Member</option>
                    <option value="2">Two Members</option>
                    <option value="3">Three Members</option>
                    <option value="4+">Four or More Members</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="einNeeded"
                    checked={formData.einNeeded}
                    onChange={(e) => updateFormData('einNeeded', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="einNeeded" className="ml-2 text-sm text-gray-700">
                    I need assistance obtaining an EIN (Federal Tax ID)
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="operatingAgreement"
                    checked={formData.operatingAgreement}
                    onChange={(e) => updateFormData('operatingAgreement', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="operatingAgreement" className="ml-2 text-sm text-gray-700">
                    I want the generic Operating Agreement template
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            {currentStep > 1 && currentStep < 4 && (
              <button
                onClick={prevStep}
                className="flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back
              </button>
            )}
            
            {currentStep < 3 && (
              <button
                onClick={nextStep}
                className="flex items-center ml-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Continue
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </button>
            )}

            {currentStep === 4 && (
              <button
                onClick={nextStep}
                className="flex items-center ml-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Continue
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LLCOrderForm