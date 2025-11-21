import { useEffect, useState } from 'react'

export default function Manage() {
  const [form, setForm] = useState({ name: '', role: '', pin: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const [staff, setStaff] = useState([])
  const [loadingStaff, setLoadingStaff] = useState(false)

  const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const loadStaff = async () => {
    setLoadingStaff(true)
    setError(null)
    try {
      const res = await fetch(`${base}/api/staff`)
      if (!res.ok) throw new Error('Could not load staff list')
      const data = await res.json()
      setStaff(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingStaff(false)
    }
  }

  useEffect(() => { loadStaff() }, [])

  const create = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    setError(null)

    if (!form.name || !form.role || !form.pin) {
      setError('Please fill in name, role, and PIN')
      setLoading(false)
      return
    }
    if (form.pin.length < 4 || form.pin.length > 8) {
      setError('PIN must be 4-8 digits')
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`${base}/api/staff`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || 'Failed to save staff')
      }
      setForm({ name: '', role: '', pin: '' })
      setMessage('Staff created. You can now log in with this PIN.')
      await loadStaff()
    } catch (err) {
      try {
        const j = JSON.parse(err.message)
        setError(j.detail || 'Failed to save staff')
      } catch {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
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
            {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
            {message && <p className="text-green-700 text-sm mb-2">{message}</p>}
            <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50">{loading? 'Saving...' : 'Save'}</button>
            <p className="text-xs text-slate-500 mt-3">If saving fails, check backend status at /test.</p>
          </form>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="font-medium mb-2">Staff</div>
          {loadingStaff ? (
            <p className="text-slate-500 text-sm">Loading staff...</p>
          ) : staff.length === 0 ? (
            <p className="text-slate-500 text-sm">No staff yet. Add the first staff member on the left.</p>
          ) : (
            <ul className="divide-y divide-slate-200">
              {staff.map(s => (
                <li key={s._id} className="py-2 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-800">{s.name}</div>
                    <div className="text-xs text-slate-500">{s.role}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${s.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>{s.is_active ? 'Active' : 'Inactive'}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
