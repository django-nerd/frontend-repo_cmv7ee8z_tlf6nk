import { useState } from 'react'

export default function Header({ user, onLogout, current, onNavigate }) {
  const tabs = [
    { id: 'menu', label: 'Menu' },
    { id: 'orders', label: 'Orders' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'manage', label: 'Manage' },
  ]
  return (
    <div className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white grid place-items-center font-bold shadow">CF</div>
          <div className="text-lg font-semibold text-slate-800">Cafeteria</div>
        </div>
        <nav className="hidden md:flex items-center gap-2">
          {tabs.map(t => (
            <button key={t.id} onClick={() => onNavigate(t.id)} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${current===t.id? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}>
              {t.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="text-sm text-slate-600">{user.name} • {user.role}</div>
              <button onClick={onLogout} className="px-3 py-2 rounded-md text-sm bg-slate-800 text-white hover:bg-slate-900">Logout</button>
            </div>
          ) : (
            <div className="text-sm text-slate-600">Not signed in</div>
          )}
        </div>
      </div>
      <div className="md:hidden border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-2 py-2 flex items-center gap-2 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => onNavigate(t.id)} className={`px-3 py-1.5 rounded-md text-sm whitespace-nowrap ${current===t.id? 'bg-blue-600 text-white' : 'text-slate-700 bg-white border border-slate-200'}`}>{t.label}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
