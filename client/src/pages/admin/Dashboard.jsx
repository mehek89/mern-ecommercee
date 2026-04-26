import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getAdminStatsApi } from '../../api/adminApi'

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/')
      return
    }
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const { data } = await getAdminStatsApi()
      setStats(data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl text-gray-500">Loading dashboard...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-gray-900 text-white px-4 py-3 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link to="/" className="text-2xl font-bold text-yellow-400">🛒 ShopMERN</Link>
          <span className="bg-yellow-400 text-gray-900 px-2 py-1 rounded text-xs font-bold">ADMIN</span>
          <div className="ml-auto flex gap-4">
            <Link to="/admin" className="text-sm hover:text-yellow-400">Dashboard</Link>
            <Link to="/admin/products" className="text-sm hover:text-yellow-400">Products</Link>
            <Link to="/admin/orders" className="text-sm hover:text-yellow-400">Orders</Link>
            <Link to="/admin/users" className="text-sm hover:text-yellow-400">Users</Link>
            <Link to="/" className="text-sm hover:text-yellow-400">← Store</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">📊 Admin Dashboard</h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-600 text-white rounded-xl p-6 shadow">
            <p className="text-blue-200 text-sm mb-1">Total Revenue</p>
            <p className="text-3xl font-bold">${stats?.totalRevenue}</p>
            <p className="text-blue-200 text-xs mt-1">All time</p>
          </div>
          <div className="bg-green-600 text-white rounded-xl p-6 shadow">
            <p className="text-green-200 text-sm mb-1">Total Orders</p>
            <p className="text-3xl font-bold">{stats?.totalOrders}</p>
            <p className="text-green-200 text-xs mt-1">{stats?.paidOrders} paid</p>
          </div>
          <div className="bg-purple-600 text-white rounded-xl p-6 shadow">
            <p className="text-purple-200 text-sm mb-1">Total Products</p>
            <p className="text-3xl font-bold">{stats?.totalProducts}</p>
            <p className="text-purple-200 text-xs mt-1">In store</p>
          </div>
          <div className="bg-orange-500 text-white rounded-xl p-6 shadow">
            <p className="text-orange-200 text-sm mb-1">Total Users</p>
            <p className="text-3xl font-bold">{stats?.totalUsers}</p>
            <p className="text-orange-200 text-xs mt-1">{stats?.pendingOrders} pending orders</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link to="/admin/products"
            className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition flex items-center gap-4">
            <span className="text-4xl">🛍️</span>
            <div>
              <h3 className="font-bold text-gray-800">Manage Products</h3>
              <p className="text-gray-500 text-sm">Add, edit, delete products</p>
            </div>
          </Link>
          <Link to="/admin/orders"
            className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition flex items-center gap-4">
            <span className="text-4xl">📦</span>
            <div>
              <h3 className="font-bold text-gray-800">Manage Orders</h3>
              <p className="text-gray-500 text-sm">Update order status</p>
            </div>
          </Link>
          <Link to="/admin/users"
            className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition flex items-center gap-4">
            <span className="text-4xl">👥</span>
            <div>
              <h3 className="font-bold text-gray-800">Manage Users</h3>
              <p className="text-gray-500 text-sm">View and manage users</p>
            </div>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">🕐 Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-600">
                  <th className="px-4 py-3 text-left rounded-l-lg">Order ID</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Total</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Paid</th>
                  <th className="px-4 py-3 text-left rounded-r-lg">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders?.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">
                      {order._id.slice(-8)}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{order.user?.name}</p>
                      <p className="text-gray-400 text-xs">{order.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 font-bold text-blue-600">${order.totalPrice}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'processing' ? 'bg-purple-100 text-purple-700' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {order.isPaid
                        ? <span className="text-green-600 font-medium">✅ Paid</span>
                        : <span className="text-red-500 font-medium">❌ Unpaid</span>
                      }
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

export default Dashboard