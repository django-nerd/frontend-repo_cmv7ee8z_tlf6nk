import { useEffect, useState } from 'react'

export default function Inventory() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ sku: '', quantity: '', unit: 'unit', reorder_level: '' })
  const [loading, setLoading] = useState(false)
  const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const load = async () => {
    const res = await fetch(`${base}/api/inventory`)
    setItems(await res.json())
  }
  useEffect(()=>{ load() },[])

  const save = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { ...form, quantity: parseFloat(form.quantity || '0'), reorder_level: form.reorder_level? parseFloat(form.reorder_level) : null }
      const res = await fetch(`${base}/api/inventory`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (res.ok) {
        setForm({ sku: '', quantity: '', unit: 'unit', reorder_level: '' })
        await load()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 grid md:grid-cols-2 gap-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-800 mb-3">Inventory</h2>
        <div className="bg-white border border-slate-200 rounded-lg divide-y">
          {items.map(i => (
            <div key={i._id} className="p-3 flex justify-between text-sm">
              <div>
                <div className="font-medium">{i.sku}</div>
                <div className="text-slate-500">Reorder: {i.reorder_level ?? '-'}</div>
              </div>
              <div className="text-slate-800">{i.quantity} {i.unit}</div>
            </div>
          ))}
          {items.length===0 && <div className="p-3 text-slate-500 text-sm">No items</div>}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium text-slate-800 mb-2">Add / Update Item</h3>
        <form onSubmit={save} className="bg-white border border-slate-200 rounded-lg p-4">
          <input value={form.sku} onChange={e=>setForm(f=>({...f, sku:e.target.value}))} placeholder="SKU / Name" className="w-full mb-2 px-3 py-2 border rounded" />
          <div className="grid grid-cols-3 gap-2">
            <input value={form.quantity} onChange={e=>setForm(f=>({...f, quantity:e.target.value}))} placeholder="Qty" className="w-full mb-2 px-3 py-2 border rounded" />
            <input value={form.unit} onChange={e=>setForm(f=>({...f, unit:e.target.value}))} placeholder="Unit" className="w-full mb-2 px-3 py-2 border rounded" />
            <input value={form.reorder_level} onChange={e=>setForm(f=>({...f, reorder_level:e.target.value}))} placeholder="Reorder level" className="w-full mb-2 px-3 py-2 border rounded" />
          </div>
          <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded">{loading? 'Saving...' : 'Save'}</button>
        </form>
      </div>
    </div>
  )
}
