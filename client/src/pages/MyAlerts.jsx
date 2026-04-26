import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axiosInstance from '../api/axiosInstance'

function MyAlerts() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    try {
      const { data } = await axiosInstance.get('/stockalerts')
      setAlerts(data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleUnsubscribe = async (alertId) => {
    try {
      await axiosInstance.delete(`/stockalerts/${alertId}`)
      setAlerts(prev => prev.filter(a => a._id !== alertId))
    } catch (error) {
      console.log(error)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl text-gray-500">Loading alerts...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white px-4 py-3 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link to="/" className="text-2xl font-bold">🛒 ShopMERN</Link>
          <div className="ml-auto flex gap-4">
            <Link to="/products" className="text-sm hover:text-yellow-300">Products</Link>
            <Link to="/wishlist" className="text-sm hover:text-yellow-300">🤍 Wishlist</Link>
            <Link to="/cart" className="text-sm hover:text-yellow-300">🛒 Cart</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">🔔 My Stock Alerts</h2>

        {alerts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow">
            <p className="text-5xl mb-4">🔔</p>
            <p className="text-gray-500 text-xl mb-4">No active stock alerts</p>
            <p className="text-gray-400 text-sm mb-6">
              When a product is out of stock, click "Notify me" to get alerted when it's back!
            </p>
            <Link to="/products" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {alerts.map((alert) => (
              <div key={alert._id} className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
                <img
                  src={alert.product?.images?.[0] || 'https://via.placeholder.com/80'}
                  alt={alert.product?.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{alert.product?.name}</h3>
                  <p className="text-blue-600 font-bold">${alert.product?.price}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    You'll be notified at <span className="font-medium">{user.email}</span>
                  </p>
                  {alert.product?.stock > 0 ? (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      ✅ Back in stock!
                    </span>
                  ) : (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                      ❌ Still out of stock
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Link
                    to={`/products/${alert.product?._id}`}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    View Product
                  </Link>
                  <button
                    onClick={() => handleUnsubscribe(alert._id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Remove Alert
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyAlerts