import { useEffect, useState } from 'react'

export default function Manage() {
  const [staff, setStaff] = useState([])
  const [form, setForm] = useState({ name: '', role: '', pin: '' })
  const [loading, setLoading] = useState(false)
  const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const load = async () => {
    // There isn't a list endpoint; we can show count from db via schema viewer usually.
    // For demo, just no-op.
  }

  useEffect(()=>{ load() },[])

  const create = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${base}/api/staff`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (res.ok) {
        setForm({ name: '', role: '', pin: '' })
        alert('Staff created. You can now login with the PIN on this device.')
      }
    } finally { setLoading(false) }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-slate-800 mb-3">Manage</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="font-medium mb-2">Add Staff</div>
          <form onSubmit={create}>
            <input value={form.name} onChange={e=>setForm(f=>({...f, name:e.target.value}))} placeholder="Full name" className="w-full mb-2 px-3 py-2 border rounded" />
            <input value={form.role} onChange={e=>setForm(f=>({...f, role:e.target.value}))} placeholder="Role (e.g., cashier)" className="w-full mb-2 px-3 py-2 border rounded" />
            <input value={form.pin} onChange={e=>setForm(f=>({...f, pin:e.target.value}))} placeholder="PIN" className="w-full mb-2 px-3 py-2 border rounded" />
            <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded">{loading? 'Saving...' : 'Save'}</button>
          </form>
        </div>
      </div>
    </div>
  )
}
