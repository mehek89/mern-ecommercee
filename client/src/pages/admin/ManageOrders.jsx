import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getAllOrdersApi, updateOrderStatusApi } from '../../api/adminApi'

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

function ManageOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return }
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const { data } = await getAllOrdersApi()
      setOrders(data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatusApi(orderId, status)
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o))
    } catch (error) {
      console.log(error)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl text-gray-500">Loading orders...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-900 text-white px-4 py-3 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link to="/" className="text-2xl font-bold text-yellow-400">🛒 ShopMERN</Link>
          <span className="bg-yellow-400 text-gray-900 px-2 py-1 rounded text-xs font-bold">ADMIN</span>
          <div className="ml-auto flex gap-4">
            <Link to="/admin" className="text-sm hover:text-yellow-400">Dashboard</Link>
            <Link to="/admin/products" className="text-sm hover:text-yellow-400">Products</Link>
            <Link to="/admin/orders" className="text-sm text-yellow-400 font-bold">Orders</Link>
            <Link to="/admin/users" className="text-sm hover:text-yellow-400">Users</Link>
            <Link to="/" className="text-sm hover:text-yellow-400">← Store</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">📦 Manage Orders ({orders.length})</h2>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-600">
                  <th className="px-4 py-3 text-left">Order ID</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Items</th>
                  <th className="px-4 py-3 text-left">Total</th>
                  <th className="px-4 py-3 text-left">Payment</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">
                      {order._id.slice(-8)}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{order.user?.name}</p>
                      <p className="text-gray-400 text-xs">{order.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {order.items?.length} items
                    </td>
                    <td className="px-4 py-3 font-bold text-blue-600">
                      ${order.totalPrice}
                    </td>
                    <td className="px-4 py-3">
                      {order.isPaid
                        ? <span className="text-green-600 text-xs font-medium">✅ Paid</span>
                        : <span className="text-red-500 text-xs font-medium">❌ Unpaid</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`px-2 py-1 rounded-lg text-xs font-medium border focus:outline-none ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-700 border-green-200' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                          order.status === 'processing' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-700 border-red-200' :
                          'bg-yellow-100 text-yellow-700 border-yellow-200'
                        }`}
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageOrders