'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import {
  RiImageLine,
  RiUploadLine,
  RiCloseLine,
  RiLinkM,
  RiMapPinLine,
  RiPriceTagLine,
  RiCheckLine,
  RiLoader4Line,
  RiAlertLine,
  RiAddLine
} from 'react-icons/ri'

interface PublicSettings {
  id: string
  name: string
  status: string
  state: string
  website: string | null
  isPublicListed: boolean
  publicDescription: string | null
  publicImageUrl: string | null
  publicCategory: string | null
  publicTags: string[]
  publicLocation: string | null
  publicLink: string | null
}

interface BusinessSettingsTabProps {
  businessId: string
  businessStatus: string
  locale: string
}

export default function BusinessSettingsTab({ businessId, businessStatus, locale: _locale }: BusinessSettingsTabProps) {
  const [settings, setSettings] = useState<PublicSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [customCategoryInput, setCustomCategoryInput] = useState('')
  const [showCustomCategory, setShowCustomCategory] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const tagInputRef = useRef<HTMLInputElement>(null)
  
  // Database options
  const [dbCategories, setDbCategories] = useState<string[]>([])
  const [dbTags, setDbTags] = useState<string[]>([])
  const [filteredTags, setFilteredTags] = useState<string[]>([])
  const [showTagSuggestions, setShowTagSuggestions] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    isPublicListed: false,
    publicDescription: '',
    publicCategory: '',
    publicTags: [] as string[],
    publicLocation: '',
    publicLink: '',
  })

  useEffect(() => {
    fetchSettings()
    fetchListingOptions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId])

  const fetchListingOptions = async () => {
    try {
      const res = await fetch('/api/public/listing-options')
      if (res.ok) {
        const data = await res.json()
        setDbCategories(data.categories || [])
        setDbTags(data.tags || [])
      }
    } catch (err) {
      console.error('Failed to fetch listing options:', err)
    }
  }

  const fetchSettings = async () => {
    try {
      const res = await fetch(`/api/businesses/${businessId}/public-settings`, {
        credentials: 'include'
      })
      if (res.ok) {
        const data = await res.json()
        setSettings(data.settings)
        
        // Auto-populate location from state if not set (check for non-empty string)
        let autoLocation = data.settings.publicLocation
        if (!autoLocation || autoLocation.trim() === '') {
          // Default to formation state + USA
          autoLocation = data.settings.state ? `${data.settings.state}, USA` : ''
        }
        
        setFormData({
          isPublicListed: data.settings.isPublicListed || false,
          publicDescription: data.settings.publicDescription || '',
          publicCategory: data.settings.publicCategory || '',
          publicTags: data.settings.publicTags || [],
          publicLocation: autoLocation,
          publicLink: data.settings.publicLink || '',
        })
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err)
    } finally {
      setLoading(false)
    }
  }

  // Filter tags based on input
  useEffect(() => {
    if (tagInput.trim()) {
      const filtered = dbTags.filter(tag => 
        tag.toLowerCase().includes(tagInput.toLowerCase()) &&
        !formData.publicTags.includes(tag)
      )
      setFilteredTags(filtered.slice(0, 8))
      setShowTagSuggestions(filtered.length > 0)
    } else {
      setFilteredTags([])
      setShowTagSuggestions(false)
    }
  }, [tagInput, dbTags, formData.publicTags])

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch(`/api/businesses/${businessId}/public-settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        const data = await res.json()
        setSettings(data.settings)
        setSuccess('Settings saved successfully!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to save settings')
      }
    } catch (_err) {
      setError('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload PNG, JPEG, or WebP.')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large. Maximum size is 5MB.')
      return
    }

    setUploadingImage(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch(`/api/businesses/${businessId}/image`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      })

      if (res.ok) {
        const data = await res.json()
        setSettings(prev => prev ? { ...prev, publicImageUrl: data.url } : null)
        setSuccess('Image uploaded successfully!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to upload image')
      }
    } catch (_err) {
      setError('Failed to upload image')
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = async () => {
    try {
      const res = await fetch(`/api/businesses/${businessId}/image`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (res.ok) {
        setSettings(prev => prev ? { ...prev, publicImageUrl: null } : null)
      }
    } catch (err) {
      console.error('Failed to remove image:', err)
    }
  }

  const addTag = (tag?: string) => {
    const tagToAdd = (tag || tagInput).trim()
    if (tagToAdd && !formData.publicTags.includes(tagToAdd)) {
      setFormData(prev => ({
        ...prev,
        publicTags: [...prev.publicTags, tagToAdd]
      }))
      setTagInput('')
      setShowTagSuggestions(false)
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      publicTags: prev.publicTags.filter(t => t !== tagToRemove)
    }))
  }

  const addCustomCategory = () => {
    const category = customCategoryInput.trim()
    if (category) {
      setFormData(prev => ({ ...prev, publicCategory: category }))
      setCustomCategoryInput('')
      setShowCustomCategory(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
        <p className="mt-4 text-gray-500">Loading settings...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Public Listing Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Public Listing Settings</h3>
        
        {/* Status Warning */}
        {businessStatus !== 'ACTIVE' && (
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6">
            <RiAlertLine className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800">Business Not Active</h4>
              <p className="text-sm text-amber-700">
                Your business must be set to ACTIVE status before it can appear on the public clients page. 
                Current status: <span className="font-semibold">{businessStatus}</span>
              </p>
            </div>
          </div>
        )}

        {/* Enable Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6">
          <div>
            <h4 className="font-medium text-gray-900">List on Clients Page</h4>
            <p className="text-sm text-gray-500">
              Allow your business to appear on our public clients/allies page
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isPublicListed}
              onChange={(e) => setFormData(prev => ({ ...prev, isPublicListed: e.target.checked }))}
              className="sr-only peer"
              disabled={businessStatus !== 'ACTIVE'}
            />
            <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600 ${businessStatus !== 'ACTIVE' ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
          </label>
        </div>

        {formData.isPublicListed && (
          <div className="space-y-6">
            {/* Business Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <RiImageLine className="inline w-4 h-4 mr-1" />
                Business Image (600×400px, 3:2 ratio)
              </label>
              <div className="flex items-start gap-4">
                {settings?.publicImageUrl ? (
                  <div className="relative group">
                    <Image
                      src={settings.publicImageUrl}
                      alt="Business"
                      width={200}
                      height={133}
                      className="rounded-lg object-cover border border-gray-200"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <RiCloseLine className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-[200px] h-[133px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                    <div className="text-center text-gray-400">
                      <RiImageLine className="w-8 h-8 mx-auto mb-1" />
                      <span className="text-xs">No image</span>
                    </div>
                  </div>
                )}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    {uploadingImage ? (
                      <RiLoader4Line className="w-4 h-4 animate-spin" />
                    ) : (
                      <RiUploadLine className="w-4 h-4" />
                    )}
                    {uploadingImage ? 'Uploading...' : 'Upload Image'}
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    PNG, JPEG, or WebP. Max 5MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.publicDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, publicDescription: e.target.value }))}
                rows={3}
                maxLength={500}
                placeholder="Describe your business in a few sentences..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.publicDescription.length}/500 characters
              </p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              {!showCustomCategory ? (
                <div className="space-y-2">
                  <select
                    value={formData.publicCategory}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setShowCustomCategory(true)
                      } else {
                        setFormData(prev => ({ ...prev, publicCategory: e.target.value }))
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option value="">Select a category</option>
                    {dbCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="__custom__">+ Add custom category...</option>
                  </select>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customCategoryInput}
                    onChange={(e) => setCustomCategoryInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomCategory())}
                    placeholder="Enter custom category..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={addCustomCategory}
                    className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    <RiCheckLine className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowCustomCategory(false); setCustomCategoryInput('') }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <RiCloseLine className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <RiMapPinLine className="inline w-4 h-4 mr-1" />
                Location
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.publicLocation}
                  onChange={(e) => setFormData(prev => ({ ...prev, publicLocation: e.target.value }))}
                  placeholder="e.g., California, USA"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
                {settings?.state && formData.publicLocation !== `${settings.state}, USA` && (
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, publicLocation: `${settings.state}, USA` }))}
                    className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
                  >
                    Use {settings.state}, USA
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Your formation state is <span className="font-medium">{settings?.state || 'not set'}</span>. Edit the location as needed.
              </p>
            </div>

            {/* Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <RiLinkM className="inline w-4 h-4 mr-1" />
                Card Link (optional)
              </label>
              <input
                type="url"
                value={formData.publicLink}
                onChange={(e) => setFormData(prev => ({ ...prev, publicLink: e.target.value }))}
                placeholder="https://your-website.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                This link will appear as a "Visit" button on your card. Leave empty to hide the button.
              </p>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <RiPriceTagLine className="inline w-4 h-4 mr-1" />
                Tags
              </label>
              <div className="relative">
                <div className="flex gap-2 mb-2">
                  <div className="relative flex-1">
                    <input
                      ref={tagInputRef}
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addTag()
                        }
                        if (e.key === 'Escape') {
                          setShowTagSuggestions(false)
                        }
                      }}
                      onFocus={() => tagInput && filteredTags.length > 0 && setShowTagSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowTagSuggestions(false), 150)}
                      placeholder="Type to search or add new tags..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                    {/* Tag suggestions dropdown */}
                    {showTagSuggestions && filteredTags.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {filteredTags.map(tag => (
                          <button
                            key={tag}
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => addTag(tag)}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-amber-50 text-gray-700 flex items-center gap-2"
                          >
                            <RiPriceTagLine className="w-3 h-3 text-gray-400" />
                            {tag}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => addTag()}
                    disabled={!tagInput.trim()}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <RiAddLine className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-2">
                Start typing to see existing tags or add your own
              </p>
              {formData.publicTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.publicTags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="text-amber-500 hover:text-amber-700"
                      >
                        <RiCloseLine className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error/Success Messages */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm flex items-center gap-2">
            <RiCheckLine className="w-4 h-4" />
            {success}
          </div>
        )}

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <RiLoader4Line className="w-4 h-4 animate-spin" />
            ) : (
              <RiCheckLine className="w-4 h-4" />
            )}
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      {/* Preview */}
      {formData.isPublicListed && settings?.publicImageUrl && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
          <p className="text-sm text-gray-500 mb-4">
            This is how your business will appear on the clients page
          </p>
          <div className="max-w-sm">
            <article className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm">
              <div className="relative aspect-[3/2] overflow-hidden">
                <Image
                  src={settings.publicImageUrl}
                  alt={settings.name}
                  fill
                  className="object-cover"
                />
                {formData.publicCategory && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm border border-gray-200/60 text-gray-800">
                    {formData.publicCategory}
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900">{settings.name}</h3>
                {formData.publicDescription && (
                  <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                    {formData.publicDescription}
                  </p>
                )}
                {formData.publicTags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {formData.publicTags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-sm">
                  {formData.publicLocation && (
                    <span className="text-gray-500 flex items-center gap-1">
                      <RiMapPinLine className="w-4 h-4" />
                      {formData.publicLocation}
                    </span>
                  )}
                  {settings.website && (
                    <span className="text-amber-600 text-xs font-medium">
                      Visit →
                    </span>
                  )}
                </div>
              </div>
            </article>
          </div>
        </div>
      )}
    </div>
  )
}
