'use client'
import { useEffect, useState, type FormEvent } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function LocalizedQuestionnairePage() {
  const params = useParams<{ locale: string; orderId: string }>()
  const orderId = (params?.orderId as string) || ''
  const searchParams = useSearchParams()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [prefill, setPrefill] = useState<any | null>(null)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const form = new FormData(e.currentTarget)
      form.set('orderId', orderId)
      const payload: Record<string, any> = {}
      form.forEach((v, k) => { payload[k] = v })
      const res = await fetch('/api/submit-questionnaire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || 'Failed to submit questionnaire')
      }
      setSuccess(true)
    } catch (err: any) {
      setError(err?.message || 'Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    const t = searchParams.get('t')
    if (!t) return
    ;(async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}?t=${encodeURIComponent(t)}`)
        const json = await res.json()
        if (res.ok) setPrefill(json.order)
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') console.debug('Prefill fetch failed', e)
      }
    })()
  }, [orderId, searchParams])

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto bg-white shadow rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-2">LLC Questionnaire</h1>
        <p className="text-gray-600 mb-6">Order ID: <span className="font-mono">{orderId}</span></p>

        {success ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded">
              Thanks! We received your answers. We’ll follow up shortly.
            </div>
            <div className="flex gap-3">
              <Link href="/" className="bg-gray-100 border rounded px-4 py-2">Home</Link>
              <Link href="/dashboard" className="bg-blue-600 text-white rounded px-4 py-2">Go to Dashboard</Link>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Contact Email</label>
                <input name="email" type="email" required className="mt-1 w-full border rounded p-2" placeholder="you@example.com" defaultValue={prefill?.contactEmail || ''} />
              </div>
              <div>
                <label className="block text-sm font-medium">Company Name</label>
                <input name="companyName" className="mt-1 w-full border rounded p-2" placeholder="Your LLC Name" defaultValue={prefill?.companyName || ''} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Business Purpose</label>
              <input name="businessPurpose" className="mt-1 w-full border rounded p-2" placeholder="e.g., e-commerce for apparel" defaultValue={prefill?.businessPurpose || ''} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Number of Members</label>
                <input name="members" className="mt-1 w-full border rounded p-2" placeholder="e.g., 1" defaultValue={prefill?.memberCount || ''} />
              </div>
              <div>
                <label className="block text-sm font-medium">Management Type</label>
                <select name="managementType" className="mt-1 w-full border rounded p-2" defaultValue={prefill?.managementStructure || 'member-managed'}>
                  <option value="member-managed">Member-managed</option>
                  <option value="manager-managed">Manager-managed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Principal Business Address</label>
              <input name="address" className="mt-1 w-full border rounded p-2" placeholder="Street, City, ZIP" defaultValue={prefill ? `${prefill.businessAddress || ''}, ${prefill.businessCity || ''}, ${prefill.businessZip || ''}` : ''} />
            </div>

            {error && <div className="text-red-600 text-sm" role="alert">{error}</div>}

            <button type="submit" disabled={submitting} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        )}

        <p className="text-sm text-gray-500 mt-6">Need help? <Link className="underline" href="/contact">Contact support</Link>.</p>
      </div>
    </div>
  )
}

