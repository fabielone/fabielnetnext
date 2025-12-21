'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RiCloseLine, RiBuilding2Line, RiAddLine } from 'react-icons/ri'

type AddBusinessOption = 'form-new' | 'add-existing'

interface AddBusinessModalProps {
  onClose: () => void
  onSuccess: () => void
  locale: string
}

export default function AddBusinessModal({ onClose, onSuccess, locale }: AddBusinessModalProps) {
  const router = useRouter()
  const [_selectedOption, setSelectedOption] = useState<AddBusinessOption | null>(null)
  const [step, setStep] = useState<'select' | 'form'>('select')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Form data for existing business
  const [formData, setFormData] = useState({
    name: '',
    entityType: 'LLC',
    state: 'CA',
    businessAddress: '',
    businessCity: '',
    businessZip: '',
    phone: '',
    email: '',
    einNumber: '',
  })

  const handleOptionSelect = (option: AddBusinessOption) => {
    setSelectedOption(option)
    if (option === 'form-new') {
      // Redirect to LLC formation checkout
      router.push(`/${locale}/checkout/businessformation`)
      onClose()
    } else {
      setStep('form')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      setError('Business name is required')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const res = await fetch('/api/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          isExisting: true,
        }),
      })
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to add business')
      }
      
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add business')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full p-6 z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {step === 'select' ? 'Add a Business' : 'Add Existing Business'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RiCloseLine className="w-5 h-5" />
            </button>
          </div>

          {step === 'select' ? (
            <div className="space-y-4">
              <p className="text-gray-600 mb-6">
                How would you like to add a business?
              </p>
              
              <button
                onClick={() => handleOptionSelect('form-new')}
                className="w-full flex items-start gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-amber-500 hover:bg-amber-50 transition-all text-left group"
              >
                <div className="p-3 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
                  <RiBuilding2Line className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Form a New LLC</h4>
                  <p className="text-sm text-gray-600">
                    Start fresh with a new California LLC. We&apos;ll handle the formation process for you.
                  </p>
                  <p className="text-sm text-amber-600 font-medium mt-2">Starting at $49.99</p>
                </div>
              </button>
              
              <button
                onClick={() => handleOptionSelect('add-existing')}
                className="w-full flex items-start gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
              >
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <RiAddLine className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Add Existing Business</h4>
                  <p className="text-sm text-gray-600">
                    Already have a business? Add it to your dashboard to manage documents and compliance.
                  </p>
                  <p className="text-sm text-blue-600 font-medium mt-2">Free to add</p>
                </div>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900"
                  placeholder="My Business LLC"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Entity Type
                  </label>
                  <select
                    value={formData.entityType}
                    onChange={(e) => setFormData({ ...formData, entityType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900"
                  >
                    <option value="LLC">LLC</option>
                    <option value="CORPORATION">Corporation</option>
                    <option value="S_CORPORATION">S Corporation</option>
                    <option value="SOLE_PROPRIETORSHIP">Sole Proprietorship</option>
                    <option value="PARTNERSHIP">Partnership</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900"
                  >
                    <option value="CA">California</option>
                    <option value="TX">Texas</option>
                    <option value="FL">Florida</option>
                    <option value="NY">New York</option>
                    <option value="DE">Delaware</option>
                    <option value="NV">Nevada</option>
                    <option value="WY">Wyoming</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  EIN (Optional)
                </label>
                <input
                  type="text"
                  value={formData.einNumber}
                  onChange={(e) => setFormData({ ...formData, einNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900"
                  placeholder="XX-XXXXXXX"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Address (Optional)
                </label>
                <input
                  type="text"
                  value={formData.businessAddress}
                  onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900"
                  placeholder="123 Main Street"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.businessCity}
                    onChange={(e) => setFormData({ ...formData, businessCity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900"
                    placeholder="Los Angeles"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={formData.businessZip}
                    onChange={(e) => setFormData({ ...formData, businessZip: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900"
                    placeholder="90001"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep('select')}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium ${
                    loading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Adding...' : 'Add Business'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
