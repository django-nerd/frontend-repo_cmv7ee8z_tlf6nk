import { useEffect, useState } from 'react'

export default function Menu() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ title: '', price: '', category: '' })
  const [loading, setLoading] = useState(false)

  const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const load = async () => {
    const res = await fetch(`${base}/api/menu`)
    const data = await res.json()
    setItems(data)
  }

  useEffect(() => { load() }, [])

  const addItem = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${base}/api/menu`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, price: parseFloat(form.price), available: true }) })
      if (res.ok) {
        setForm({ title: '', price: '', category: '' })
        await load()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">Menu</h2>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="grid sm:grid-cols-2 gap-3">
            {items.map(i => (
              <div key={i._id} className="border border-slate-200 rounded-lg p-4 bg-white">
                <div className="flex justify-between"><div className="font-medium">{i.title}</div><div className="text-slate-700">${Number(i.price).toFixed(2)}</div></div>
                <div className="text-sm text-slate-500">{i.category || 'General'}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <form onSubmit={addItem} className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="font-medium mb-2">Add Item</div>
            <input value={form.title} onChange={e=>setForm(f=>({...f, title:e.target.value}))} placeholder="Item name" className="w-full mb-2 px-3 py-2 border rounded" />
            <input value={form.price} onChange={e=>setForm(f=>({...f, price:e.target.value}))} placeholder="Price" className="w-full mb-2 px-3 py-2 border rounded" />
            <input value={form.category} onChange={e=>setForm(f=>({...f, category:e.target.value}))} placeholder="Category" className="w-full mb-2 px-3 py-2 border rounded" />
            <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded">{loading? 'Saving...' : 'Save'}</button>
          </form>
        </div>
      </div>
    </div>
  )
}
