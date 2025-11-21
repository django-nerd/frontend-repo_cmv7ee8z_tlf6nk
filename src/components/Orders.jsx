import { useEffect, useMemo, useState } from 'react'

export default function Orders() {
  const [menu, setMenu] = useState([])
  const [cart, setCart] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const load = async () => {
    const [mRes, oRes] = await Promise.all([
      fetch(`${base}/api/menu`),
      fetch(`${base}/api/orders`),
    ])
    setMenu(await mRes.json())
    setOrders(await oRes.json())
  }

  useEffect(()=>{ load() },[])

  const addToCart = (m) => {
    setCart(c => {
      const idx = c.findIndex(x => x._id === m._id)
      if (idx>-1) {
        const nc = [...c]
        nc[idx] = { ...nc[idx], quantity: nc[idx].quantity + 1 }
        return nc
      }
      return [...c, { ...m, quantity: 1 }]
    })
  }

  const subtotal = useMemo(()=> cart.reduce((s,i)=> s + Number(i.price)*i.quantity, 0), [cart])

  const checkout = async () => {
    if (cart.length===0) return
    setLoading(true)
    try {
      const payload = { items: cart.map(i=>({ menu_item_id: i._id, quantity: i.quantity })) }
      const res = await fetch(`${base}/api/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (res.ok) {
        setCart([])
        await load()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 grid md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <h2 className="text-xl font-semibold text-slate-800 mb-3">Create Order</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {menu.map(m => (
            <button key={m._id} onClick={()=>addToCart(m)} className="border border-slate-200 rounded-lg p-4 bg-white text-left hover:shadow">
              <div className="font-medium">{m.title}</div>
              <div className="text-slate-600 text-sm">${Number(m.price).toFixed(2)}</div>
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="font-medium mb-2">Cart</div>
          <div className="space-y-2">
            {cart.map(i => (
              <div key={i._id} className="flex justify-between text-sm">
                <div>{i.title} × {i.quantity}</div>
                <div>${(Number(i.price)*i.quantity).toFixed(2)}</div>
              </div>
            ))}
            {cart.length===0 && <div className="text-slate-500 text-sm">No items</div>}
          </div>
          <div className="border-t mt-3 pt-3 flex justify-between font-medium">
            <div>Subtotal</div>
            <div>${subtotal.toFixed(2)}</div>
          </div>
          <button disabled={loading || cart.length===0} onClick={checkout} className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded disabled:opacity-50">{loading? 'Processing...' : 'Checkout'}</button>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 mt-4">
          <div className="font-medium mb-2">Recent Orders</div>
          <div className="space-y-2 max-h-64 overflow-auto">
            {orders.slice().reverse().map(o => (
              <div key={o._id} className="flex justify-between text-sm">
                <div>#{o._id.slice(-5)} • {o.items?.length || 0} items</div>
                <div>${Number(o.total).toFixed(2)}</div>
              </div>
            ))}
            {orders.length===0 && <div className="text-slate-500 text-sm">No orders</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
