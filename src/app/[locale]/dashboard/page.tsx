'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useSearchParams, useRouter, useParams } from 'next/navigation'

type Order = {
  id: string
  orderId: string
  companyName: string
  totalAmount: string | number | null
  status: string
  websiteService: string | null
  createdAt: string
}

type Document = {
  id: string
  documentType: string
  fileName: string
  filePath: string
  isFinal: boolean
  isLatest: boolean
  generatedAt: string
}

export default function LocalizedDashboard() {
  const t = useTranslations('dashboard')
  const sp = useSearchParams()
  const _router = useRouter()
  const { locale: _locale } = useParams() as { locale: string }
  const token = sp.get('t')

  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const qs = useMemo(() => (token ? `?t=${encodeURIComponent(token)}` : ''), [token])

  useEffect(() => {
    let ignore = false
    async function run() {
      if (!token) {
        setError('Missing secure link. Please use the link from your email.')
        return
      }
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/orders/list${qs}`, { cache: 'no-store' })
        if (!res.ok) throw new Error(`Failed to load orders (${res.status})`)
        const data = await res.json()
        if (ignore) return
        setOrders(data.orders)
        setSelectedOrder(data.orders?.[0] || null)
      } catch (e: unknown) {
        if (ignore) return
        const errorMessage = e instanceof Error ? e.message : 'Failed to load'
        setError(errorMessage)
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    run()
    return () => { ignore = true }
  }, [qs, token])

  useEffect(() => {
    let ignore = false
    async function loadDocs(order: Order | null) {
      if (!order || !token) return setDocuments([])
      try {
        const res = await fetch(`/api/orders/${order.orderId}/documents${qs}`, { cache: 'no-store' })
        if (!res.ok) throw new Error(`Failed to load documents (${res.status})`)
        const data = await res.json()
        if (!ignore) setDocuments(data.documents)
      } catch {
        if (!ignore) setDocuments([])
      }
    }
    loadDocs(selectedOrder)
    return () => { ignore = true }
  }, [selectedOrder, qs, token])

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!selectedOrder || !token) return
    const form = e.currentTarget
    const fd = new FormData(form)
    // If a file input is provided, upload it to storage first
    const file = (form.querySelector('input[name="blob"]') as HTMLInputElement)?.files?.[0]
    let fileUrl = String(fd.get('filePath') || '')
    if (file) {
      const uploadFd = new FormData()
      uploadFd.append('file', file)
      uploadFd.append('folder', `orders/${selectedOrder.orderId}`)
      const up = await fetch(`/api/uploads/supabase${qs}`, { method: 'POST', body: uploadFd })
      if (!up.ok) throw new Error('Upload failed')
      const upJson = await up.json()
      fileUrl = upJson.url
      fd.set('filePath', fileUrl)
      fd.set('fileName', file.name)
    }

    const payload = {
      documentType: String(fd.get('documentType')),
      fileName: String(fd.get('fileName')),
      filePath: String(fd.get('filePath')) || fileUrl,
      fileSize: file ? file.size : (fd.get('fileSize') ? Number(fd.get('fileSize')) : undefined),
    }
    const res = await fetch(`/api/orders/${selectedOrder.orderId}/documents${qs}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (res.ok) {
      form.reset()
      // refresh documents
      const d = await fetch(`/api/orders/${selectedOrder.orderId}/documents${qs}`).then(r => r.json())
      setDocuments(d.documents)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white shadow rounded-xl p-6">
          <h1 className="text-2xl font-bold mb-2">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
          {!token && (
            <p className="mt-4 text-sm text-red-600">Secure token missing. Use your emailed dashboard link.</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-xl p-4 md:col-span-1">
            <h2 className="font-semibold mb-3">Your Orders</h2>
            {loading && <p className="text-sm text-gray-500">Loading…</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}
            <ul className="divide-y">
              {orders.map(o => (
                <li key={o.id} className={`py-3 cursor-pointer ${selectedOrder?.id === o.id ? 'bg-amber-50 rounded-lg px-2' : ''}`} onClick={() => setSelectedOrder(o)}>
                  <div className="text-sm font-medium">{o.companyName} LLC</div>
                  <div className="text-xs text-gray-600">{o.orderId} • {(o.totalAmount ?? 0).toString()}</div>
                  <div className="text-xs text-gray-500">{o.status.replaceAll('_', ' ').toLowerCase()}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white shadow rounded-xl p-4 md:col-span-2">
            <h2 className="font-semibold mb-3">Order Details</h2>
            {!selectedOrder && <p className="text-sm text-gray-500">Select an order to view details.</p>}
            {selectedOrder && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-500">Order ID:</span> {selectedOrder.orderId}</div>
                  <div><span className="text-gray-500">Company:</span> {selectedOrder.companyName} LLC</div>
                  <div><span className="text-gray-500">Website Service:</span> {selectedOrder.websiteService || '—'}</div>
                  <div><span className="text-gray-500">Status:</span> {selectedOrder.status.replaceAll('_',' ').toLowerCase()}</div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Documents</h3>
                  <ul className="divide-y">
                    {documents.map(d => (
                      <li key={d.id} className="py-2 text-sm">
                        <div className="font-medium">{d.documentType.replaceAll('_',' ')}</div>
                        <div className="text-gray-600">{d.fileName}</div>
                        <a className="text-amber-700 hover:underline" href={d.filePath} target="_blank" rel="noreferrer">View</a>
                      </li>
                    ))}
                    {documents.length === 0 && <li className="py-2 text-sm text-gray-500">No documents yet.</li>}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Upload a file</h3>
                  <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-5 gap-3 text-sm">
                    <select name="documentType" required className="border rounded px-2 py-1">
                      <option value="INVOICE">Invoice</option>
                      <option value="RECEIPT">Receipt</option>
                      <option value="OPERATING_AGREEMENT">Operating Agreement</option>
                      <option value="ARTICLES_OF_ORGANIZATION">Articles of Organization</option>
                      <option value="EIN_CONFIRMATION">EIN Confirmation</option>
                      <option value="BANK_RESOLUTION_LETTER">Bank Resolution Letter</option>
                    </select>
                    <input name="fileName" placeholder="file.pdf" className="border rounded px-2 py-1" />
                    <input name="filePath" placeholder="https://storage.example.com/file.pdf" className="border rounded px-2 py-1" />
                    <input type="file" name="blob" className="border rounded px-2 py-1" />
                    <button className="bg-amber-600 text-white rounded px-3 py-1">Save</button>
                  </form>
                  <p className="mt-2 text-xs text-gray-500">Tip: Provide either a URL or select a file to upload (Supabase Storage).</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Add services</h3>
                  <div className="text-sm text-gray-600">Coming next: choose add-ons like Registered Agent, Compliance, Website tiers, Marketing.</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
