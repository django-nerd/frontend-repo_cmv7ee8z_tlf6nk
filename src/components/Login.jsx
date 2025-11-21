import { useState } from 'react'

export default function Login({ onLogin }) {
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const res = await fetch(`${base}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pin }) })
      if (!res.ok) throw new Error('Invalid PIN')
      const data = await res.json()
      onLogin(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[50vh] grid place-items-center">
      <form onSubmit={submit} className="bg-white/80 backdrop-blur rounded-xl border border-slate-200 p-6 w-full max-w-sm shadow">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Staff Login</h2>
        <label className="block text-sm text-slate-600 mb-2">Enter PIN</label>
        <input value={pin} onChange={(e)=>setPin(e.target.value)} className="w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="1234" />
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        <button disabled={loading} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md disabled:opacity-50">{loading? 'Signing in...' : 'Sign In'}</button>
        <p className="text-xs text-slate-500 mt-3">Tip: create a staff user in Manage tab if none exists.</p>
      </form>
    </div>
  )
}
