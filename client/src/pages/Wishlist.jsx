import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getWishlistApi, removeFromWishlistApi } from '../api/wishlistApi'
import { addToCartApi } from '../api/cartApi'

function Wishlist() {
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    try {
      const { data } = await getWishlistApi()
      setWishlist(data.products || [])
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlistApi(productId)
      setWishlist(prev => prev.filter(p => p._id !== productId))
    } catch (error) {
      console.log(error)
    }
  }

  const handleAddToCart = async (product) => {
    try {
      await addToCartApi({
        productId: product._id,
        name: product.name,
        image: product.images[0],
        price: product.price,
        quantity: 1
      })
      alert('Added to cart!')
    } catch (error) {
      console.log(error)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl text-gray-500">Loading wishlist...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white px-4 py-3 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link to="/" className="text-2xl font-bold">🛒 ShopMERN</Link>
          <div className="ml-auto flex gap-4">
            <Link to="/products" className="text-sm hover:text-yellow-300">Products</Link>
            <Link to="/cart" className="text-sm hover:text-yellow-300">🛒 Cart</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">🤍 My Wishlist</h2>

        {wishlist.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow">
            <p className="text-5xl mb-4">🤍</p>
            <p className="text-gray-500 text-xl mb-4">Your wishlist is empty</p>
            <Link to="/products" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {wishlist.map((product) => (
              <div key={product._id} className="bg-white rounded-xl shadow overflow-hidden">
                <div className="relative">
                  <img
                    src={product.images[0] || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => handleRemove(product._id)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition text-lg"
                  >
                    ♥
                  </button>
                </div>
                <div className="p-4">
                  <Link to={`/products/${product._id}`}>
                    <h3 className="font-semibold text-gray-800 mb-1 hover:text-blue-600 truncate">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-blue-600 font-bold mb-3">${product.price}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemove(product._id)}
                      className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-200 transition text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Wishlist