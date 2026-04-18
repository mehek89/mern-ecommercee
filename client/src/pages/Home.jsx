import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../redux/slices/authSlice'
import { getProductsApi } from '../api/productApi'

function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await getProductsApi()
        setProducts(data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Top Navbar */}
      <nav className="bg-blue-600 text-white px-4 py-3 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center gap-4">

          {/* Logo */}
          <Link to="/" className="text-2xl font-bold whitespace-nowrap">
            🛒 ShopMERN
          </Link>

          {/* Search Bar */}
          <div className="flex flex-1 max-w-2xl">
            <input
              type="text"
              placeholder="Search for products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 text-gray-800 rounded-l-md focus:outline-none"
            />
            <button className="bg-yellow-400 px-4 py-2 rounded-r-md hover:bg-yellow-500">
              🔍
            </button>
          </div>

          {/* Nav Links */}
          <div className="flex items-center gap-4 ml-auto whitespace-nowrap">
            {user ? (
              <>
                <span className="text-sm">Hi, {user.name.split(' ')[0]}</span>
                <Link to="/orders" className="text-sm hover:text-yellow-300">Orders</Link>
                <button onClick={handleLogout} className="text-sm hover:text-yellow-300">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm hover:text-yellow-300">Login</Link>
                <Link to="/register" className="text-sm hover:text-yellow-300">Register</Link>
              </>
            )}
            <Link to="/cart" className="text-sm hover:text-yellow-300">🛒 Cart</Link>
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-12 px-4 text-center">
        <h1 className="text-4xl font-bold mb-3">Welcome to ShopMERN</h1>
        <p className="text-lg mb-6 opacity-90">Best deals on top products — every day!</p>
        <Link
          to="/products"
          className="bg-yellow-400 text-gray-900 font-bold px-8 py-3 rounded-full hover:bg-yellow-500 transition text-lg"
        >
          Shop Now →
        </Link>
      </div>

      {/* Category Pills */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex gap-3 overflow-x-auto">
        {['All', 'Electronics', 'Fashion', 'Home', 'Books', 'Sports'].map(cat => (
          <button
            key={cat}
            className="bg-white px-4 py-2 rounded-full shadow text-sm font-medium hover:bg-blue-600 hover:text-white transition whitespace-nowrap"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {search ? `Results for "${search}"` : '🔥 Featured Products'}
        </h2>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-xl">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((product) => (
              <Link
                to={`/products/${product._id}`}
                key={product._id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden group"
              >
                <div className="overflow-hidden">
                  <img
                    src={product.images[0] || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-gray-800 text-sm mb-1 truncate">
                    {product.name}
                  </h3>
                  <p className="text-gray-400 text-xs mb-2">{product.category}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-blue-600 font-bold text-lg">${product.price}</p>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      In Stock
                    </span>
                  </div>
                  <div className="text-yellow-400 text-xs mt-1">★★★★☆</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-blue-800 text-white mt-12 py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <h4 className="font-bold mb-3">ShopMERN</h4>
            <p className="text-sm text-blue-200">Your trusted online store</p>
          </div>
          <div>
            <h4 className="font-bold mb-3">Quick Links</h4>
            <div className="flex flex-col gap-1 text-sm text-blue-200">
              <Link to="/products" className="hover:text-white">Products</Link>
              <Link to="/cart" className="hover:text-white">Cart</Link>
              <Link to="/orders" className="hover:text-white">Orders</Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-3">Account</h4>
            <div className="flex flex-col gap-1 text-sm text-blue-200">
              <Link to="/login" className="hover:text-white">Login</Link>
              <Link to="/register" className="hover:text-white">Register</Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-3">Contact</h4>
            <p className="text-sm text-blue-200">support@shopmern.com</p>
          </div>
        </div>
        <div className="text-center text-blue-300 text-sm mt-8">
          © 2024 ShopMERN. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default Home