'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import {
  FaCheck,
  FaShieldAlt,
  FaFileAlt,
  FaCalendarCheck,
  FaUserTie,
  FaClipboardList,
  FaArrowLeft,
} from 'react-icons/fa';
import { useNavigationLoading } from '../../../components/hooks/useNavigationLoading';
import LoadingSpinner from '../../../components/atoms/LoadingSpinner';

interface StateFee {
  stateCode: string;
  stateName: string;
  filingFee: number;
  annualReportFee: number | null;
  franchiseTaxFee: number | null;
  rushFee: number | null;
  rushAvailable: boolean;
  standardDays: number;
}

interface FormData {
  // Company details
  companyName: string;
  formationState: string;
  einNumber: string;
  // Contact
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // Address
  businessAddress: string;
  businessCity: string;
  businessState: string;
  businessZip: string;
  // Options
  rushProcessing: boolean;
  // Beneficial owners for BOIR
  beneficialOwners: BeneficialOwner[];
}

interface BeneficialOwner {
  fullName: string;
  dateOfBirth: string;
  address: string;
  idType: 'passport' | 'drivers_license' | 'state_id';
  idNumber: string;
}

const SERVICE_PRICE = 199;
const RA_INCLUDED_PRICE = 149;

const emptyOwner: BeneficialOwner = {
  fullName: '',
  dateOfBirth: '',
  address: '',
  idType: 'drivers_license',
  idNumber: '',
};

export default function ComplianceCheckoutPage() {
  const locale = useLocale();
  const { navigateWithLoading } = useNavigationLoading();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [stateFees, setStateFees] = useState<StateFee[]>([]);
  const [loadingFees, setLoadingFees] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    formationState: '',
    einNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessAddress: '',
    businessCity: '',
    businessState: '',
    businessZip: '',
    rushProcessing: false,
    beneficialOwners: [{ ...emptyOwner }],
  });

  useEffect(() => {
    const fetchStateFees = async () => {
      try {
        const res = await fetch('/api/state-fees');
        const data = await res.json();
        if (data.success) setStateFees(data.data);
      } catch (err) {
        console.error('Failed to load state fees', err);
      } finally {
        setLoadingFees(false);
      }
    };
    fetchStateFees();
  }, []);

  const selectedFee = stateFees.find((f) => f.stateCode === formData.formationState);

  const annualReportFee = selectedFee?.annualReportFee || 0;
  const franchiseTaxFee = selectedFee?.franchiseTaxFee || 0;
  const rushFee = formData.rushProcessing && selectedFee?.rushFee ? selectedFee.rushFee : 0;
  const totalStateFees = annualReportFee + franchiseTaxFee + rushFee;
  const orderTotal = SERVICE_PRICE + totalStateFees;

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const updateOwner = (index: number, field: keyof BeneficialOwner, value: string) => {
    setFormData((prev) => {
      const owners = [...prev.beneficialOwners];
      owners[index] = { ...owners[index], [field]: value };
      return { ...prev, beneficialOwners: owners };
    });
  };

  const addOwner = () => {
    if (formData.beneficialOwners.length < 4) {
      setFormData((prev) => ({
        ...prev,
        beneficialOwners: [...prev.beneficialOwners, { ...emptyOwner }],
      }));
    }
  };

  const removeOwner = (index: number) => {
    if (formData.beneficialOwners.length > 1) {
      setFormData((prev) => ({
        ...prev,
        beneficialOwners: prev.beneficialOwners.filter((_, i) => i !== index),
      }));
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.formationState) newErrors.formationState = 'Please select a state';
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Invalid email address';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    formData.beneficialOwners.forEach((owner, i) => {
      if (!owner.fullName.trim()) newErrors[`owner_${i}_fullName`] = 'Full name is required';
      if (!owner.dateOfBirth) newErrors[`owner_${i}_dob`] = 'Date of birth is required';
      if (!owner.idNumber.trim()) newErrors[`owner_${i}_idNumber`] = 'ID number is required';
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // TODO: Submit to API / payment processor
      console.log('Compliance order submitted:', { formData, orderTotal });
      alert('Thank you! Your compliance package enrollment has been received. We will reach out shortly.');
    } catch (err) {
      console.error('Submission failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b border-purple-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateWithLoading(`/${locale}/compliance`)}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <FaArrowLeft className="h-3 w-3" /> Back
            </button>
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Compliance Package Checkout
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                by <span className="font-semibold text-purple-600">Fabiel.net</span>
              </p>
            </div>
            <div className="w-16" />
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-2 mb-8">
          {[
            { id: 1, label: 'Company & Contact' },
            { id: 2, label: 'BOIR Details' },
            { id: 3, label: 'Review & Pay' },
          ].map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors ${
                  step >= s.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}
              >
                {step > s.id ? <FaCheck className="h-3 w-3" /> : s.id}
              </div>
              <span
                className={`hidden sm:inline text-sm font-medium ${
                  step >= s.id ? 'text-gray-900 dark:text-white' : 'text-gray-400'
                }`}
              >
                {s.label}
              </span>
              {i < 2 && (
                <div
                  className={`w-12 h-0.5 mx-1 ${
                    step > s.id ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
                {/* Step 1: Company & Contact */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                      Company & Contact Information
                    </h2>

                    <div className="space-y-5">
                      {/* Company Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          LLC Name *
                        </label>
                        <input
                          type="text"
                          value={formData.companyName}
                          onChange={(e) => updateField('companyName', e.target.value)}
                          className={`w-full px-4 py-3 rounded-lg border ${errors.companyName ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500`}
                          placeholder="Your LLC Name"
                        />
                        {errors.companyName && (
                          <p className="mt-1 text-sm text-red-500">{errors.companyName}</p>
                        )}
                      </div>

                      {/* Formation State */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Formation State *
                        </label>
                        <select
                          value={formData.formationState}
                          onChange={(e) => updateField('formationState', e.target.value)}
                          className={`w-full px-4 py-3 rounded-lg border ${errors.formationState ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500`}
                        >
                          <option value="">Select state</option>
                          {stateFees.map((s) => (
                            <option key={s.stateCode} value={s.stateCode}>
                              {s.stateName}
                            </option>
                          ))}
                        </select>
                        {errors.formationState && (
                          <p className="mt-1 text-sm text-red-500">{errors.formationState}</p>
                        )}
                      </div>

                      {/* EIN */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          EIN (Tax ID) <span className="text-gray-400">— optional</span>
                        </label>
                        <input
                          type="text"
                          value={formData.einNumber}
                          onChange={(e) => updateField('einNumber', e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                          placeholder="XX-XXXXXXX"
                        />
                      </div>

                      <hr className="border-gray-200 dark:border-gray-700" />

                      {/* Contact */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            First Name *
                          </label>
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => updateField('firstName', e.target.value)}
                            className={`w-full px-4 py-3 rounded-lg border ${errors.firstName ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500`}
                          />
                          {errors.firstName && (
                            <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => updateField('lastName', e.target.value)}
                            className={`w-full px-4 py-3 rounded-lg border ${errors.lastName ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500`}
                          />
                          {errors.lastName && (
                            <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email *
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => updateField('email', e.target.value)}
                            className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500`}
                          />
                          {errors.email && (
                            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Phone *
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => updateField('phone', e.target.value)}
                            className={`w-full px-4 py-3 rounded-lg border ${errors.phone ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500`}
                          />
                          {errors.phone && (
                            <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                          )}
                        </div>
                      </div>

                      <hr className="border-gray-200 dark:border-gray-700" />

                      {/* Business Address */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Business Address
                        </label>
                        <input
                          type="text"
                          value={formData.businessAddress}
                          onChange={(e) => updateField('businessAddress', e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                          placeholder="Street Address"
                        />
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <input
                          type="text"
                          value={formData.businessCity}
                          onChange={(e) => updateField('businessCity', e.target.value)}
                          className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                          placeholder="City"
                        />
                        <input
                          type="text"
                          value={formData.businessState}
                          onChange={(e) => updateField('businessState', e.target.value)}
                          className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                          placeholder="State"
                        />
                        <input
                          type="text"
                          value={formData.businessZip}
                          onChange={(e) => updateField('businessZip', e.target.value)}
                          className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                          placeholder="ZIP"
                        />
                      </div>

                      {/* Rush */}
                      {selectedFee?.rushAvailable && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4">
                          <label className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.rushProcessing}
                              onChange={(e) => updateField('rushProcessing', e.target.checked)}
                              className="mt-1 h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            />
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">
                                Rush Processing — ${selectedFee.rushFee}
                              </span>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Expedite all filings (est. faster turnaround)
                              </p>
                            </div>
                          </label>
                        </div>
                      )}
                    </div>

                    <div className="mt-8 flex justify-end">
                      <button
                        type="button"
                        onClick={handleNext}
                        className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-colors"
                      >
                        Continue to BOIR Details →
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: BOIR Details */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Beneficial Ownership Information (BOIR)
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                      Required by the Corporate Transparency Act. Provide details for each individual
                      who owns 25%+ or exercises substantial control.
                    </p>

                    {formData.beneficialOwners.map((owner, i) => (
                      <div
                        key={i}
                        className="mb-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5 border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            Beneficial Owner {i + 1}
                          </h3>
                          {formData.beneficialOwners.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeOwner(i)}
                              className="text-sm text-red-500 hover:text-red-700 font-medium"
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Full Legal Name *
                            </label>
                            <input
                              type="text"
                              value={owner.fullName}
                              onChange={(e) => updateOwner(i, 'fullName', e.target.value)}
                              className={`w-full px-4 py-3 rounded-lg border ${errors[`owner_${i}_fullName`] ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500`}
                            />
                            {errors[`owner_${i}_fullName`] && (
                              <p className="mt-1 text-sm text-red-500">{errors[`owner_${i}_fullName`]}</p>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Date of Birth *
                              </label>
                              <input
                                type="date"
                                value={owner.dateOfBirth}
                                onChange={(e) => updateOwner(i, 'dateOfBirth', e.target.value)}
                                className={`w-full px-4 py-3 rounded-lg border ${errors[`owner_${i}_dob`] ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500`}
                              />
                              {errors[`owner_${i}_dob`] && (
                                <p className="mt-1 text-sm text-red-500">{errors[`owner_${i}_dob`]}</p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Residential Address
                              </label>
                              <input
                                type="text"
                                value={owner.address}
                                onChange={(e) => updateOwner(i, 'address', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                ID Type *
                              </label>
                              <select
                                value={owner.idType}
                                onChange={(e) =>
                                  updateOwner(i, 'idType', e.target.value as BeneficialOwner['idType'])
                                }
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                              >
                                <option value="drivers_license">Driver&apos;s License</option>
                                <option value="passport">Passport</option>
                                <option value="state_id">State ID</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                ID Number *
                              </label>
                              <input
                                type="text"
                                value={owner.idNumber}
                                onChange={(e) => updateOwner(i, 'idNumber', e.target.value)}
                                className={`w-full px-4 py-3 rounded-lg border ${errors[`owner_${i}_idNumber`] ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500`}
                              />
                              {errors[`owner_${i}_idNumber`] && (
                                <p className="mt-1 text-sm text-red-500">{errors[`owner_${i}_idNumber`]}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {formData.beneficialOwners.length < 4 && (
                      <button
                        type="button"
                        onClick={addOwner}
                        className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
                      >
                        + Add Another Beneficial Owner
                      </button>
                    )}

                    <div className="mt-8 flex justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-colors"
                      >
                        Review Order →
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Review & Pay */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                      Review Your Order
                    </h2>

                    {/* Summary */}
                    <div className="space-y-4 mb-8">
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                          Company Details
                        </h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <span className="text-gray-500">LLC Name</span>
                          <span className="text-gray-900 dark:text-white font-medium">
                            {formData.companyName}
                          </span>
                          <span className="text-gray-500">State</span>
                          <span className="text-gray-900 dark:text-white font-medium">
                            {selectedFee?.stateName || formData.formationState}
                          </span>
                          <span className="text-gray-500">Contact</span>
                          <span className="text-gray-900 dark:text-white font-medium">
                            {formData.firstName} {formData.lastName}
                          </span>
                          <span className="text-gray-500">Email</span>
                          <span className="text-gray-900 dark:text-white font-medium">
                            {formData.email}
                          </span>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                          Beneficial Owners ({formData.beneficialOwners.length})
                        </h3>
                        {formData.beneficialOwners.map((owner, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 py-1"
                          >
                            <FaCheck className="h-3 w-3 text-emerald-500" />
                            {owner.fullName}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Payment placeholder */}
                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-xl p-5 mb-6">
                      <p className="text-sm text-purple-800 dark:text-purple-300 font-medium">
                        💳 Payment integration coming soon. Your order will be saved and our team
                        will reach out to complete payment.
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
                      >
                        ← Back
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50"
                      >
                        {submitting ? (
                          <LoadingSpinner size="small" color="text-white" message="" />
                        ) : (
                          `Submit Order — $${orderTotal.toFixed(2)}`
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Order Summary
              </h3>

              <div className="space-y-3 mb-6">
                {[
                  { icon: <FaFileAlt />, label: 'Annual Report Filing' },
                  { icon: <FaUserTie />, label: 'Registered Agent' },
                  { icon: <FaClipboardList />, label: 'BOIR Filing' },
                  { icon: <FaCalendarCheck />, label: 'Compliance Calendar' },
                  { icon: <FaShieldAlt />, label: 'Good Standing Support' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className="text-purple-500">{item.icon}</span>
                    <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                    <FaCheck className="ml-auto h-3 w-3 text-emerald-500" />
                  </div>
                ))}
              </div>

              <hr className="border-gray-200 dark:border-gray-700 mb-4" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Service Fee</span>
                  <span className="font-medium text-gray-900 dark:text-white">${SERVICE_PRICE}.00</span>
                </div>
                {selectedFee && (
                  <>
                    {annualReportFee > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Annual Report Fee</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          ${annualReportFee.toFixed(2)}
                        </span>
                      </div>
                    )}
                    {franchiseTaxFee > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Franchise Tax</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          ${franchiseTaxFee.toFixed(2)}
                        </span>
                      </div>
                    )}
                    {rushFee > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Rush Processing</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          ${rushFee.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>

              <hr className="border-gray-200 dark:border-gray-700 my-4" />

              <div className="flex justify-between text-lg font-bold">
                <span className="text-gray-900 dark:text-white">Total</span>
                <span className="text-purple-600">${orderTotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Billed annually</p>

              {!selectedFee && (
                <p className="mt-4 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                  Select your formation state in Step 1 to see state-specific fees.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
