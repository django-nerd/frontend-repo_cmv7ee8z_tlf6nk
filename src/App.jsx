import { useEffect, useState } from 'react'
import Header from './components/Header'
import Login from './components/Login'
import Menu from './components/Menu'
import Orders from './components/Orders'
import Inventory from './components/Inventory'
import Manage from './components/Manage'

function App() {
  const [user, setUser] = useState(null)
  const [view, setView] = useState('menu')

  useEffect(()=>{
    // restore session
    const u = localStorage.getItem('caf_user')
    if (u) setUser(JSON.parse(u))
  },[])

  const onLogin = (u) => {
    setUser(u)
    localStorage.setItem('caf_user', JSON.stringify(u))
  }
  const onLogout = () => {
    setUser(null)
    localStorage.removeItem('caf_user')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header user={user} onLogout={onLogout} current={view} onNavigate={setView} />
      <main className="max-w-6xl mx-auto px-4 py-6">
        {!user ? (
          <Login onLogin={onLogin} />
        ) : (
          <div className="space-y-4">
            {view === 'menu' && <Menu />}
            {view === 'orders' && <Orders />}
            {view === 'inventory' && <Inventory />}
            {view === 'manage' && <Manage />}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
