import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { getProductByIdApi } from '../api/productApi'
import { addToCartApi } from '../api/cartApi'
import { setCart } from '../redux/slices/cartSlice'

function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [message, setMessage] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await getProductByIdApi(id)
        setProduct(data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = async () => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user) {
      navigate('/login')
      return
    }
    setAdding(true)
    try {
      const { data } = await addToCartApi({
        productId: product._id,
        name: product.name,
        image: product.images[0],
        price: product.price,
        quantity: 1
      })
      dispatch(setCart(data))
      setMessage('✅ Added to cart!')
      setTimeout(() => setMessage(''), 2000)
    } catch (error) {
      setMessage('❌ Failed to add to cart')
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-500">Loading...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-500">Product not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">🛒 ShopMERN</Link>
        <div className="flex gap-4">
          <Link to="/products" className="text-gray-600 hover:text-blue-600">Products</Link>
          <Link to="/cart" className="text-gray-600 hover:text-blue-600">Cart</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/products" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Products
        </Link>

        <div className="bg-white rounded-xl shadow p-8 flex flex-col md:flex-row gap-8">
          <img
            src={product.images[0] || 'https://via.placeholder.com/400'}
            alt={product.name}
            className="w-full md:w-80 h-80 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h2>
            <p className="text-gray-500 mb-4">{product.category} • {product.brand}</p>
            <p className="text-gray-600 mb-6">{product.description}</p>
            <p className="text-3xl font-bold text-blue-600 mb-4">${product.price}</p>
            <p className="text-sm text-gray-500 mb-6">
              {product.stock > 0 ? `✅ ${product.stock} in stock` : '❌ Out of stock'}
            </p>

            {message && (
              <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                {message}
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 w-full"
            >
              {adding ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail