import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getCartApi, removeFromCartApi } from '../api/cartApi'
import { setCart, clearCart } from '../redux/slices/cartSlice'

function Cart() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, totalPrice } = useSelector((state) => state.cart)

  useEffect(() => {
    const fetchCart = async () => {
      const user = JSON.parse(localStorage.getItem('user'))
      if (!user) {
        navigate('/login')
        return
      }
      try {
        const { data } = await getCartApi()
        dispatch(setCart(data))
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    fetchCart()
  }, [])

  const handleRemove = async (productId) => {
    try {
      const { data } = await removeFromCartApi(productId)
      dispatch(setCart(data))
    } catch (error) {
      console.log(error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-500">Loading cart...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">🛒 ShopMERN</Link>
        <Link to="/products" className="text-gray-600 hover:text-blue-600">Products</Link>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Your Cart</h2>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-xl mb-4">Your cart is empty</p>
            <Link to="/products" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <div key={item._id} className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
                <img
                  src={item.image || 'https://via.placeholder.com/100'}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-gray-500">Qty: {item.quantity}</p>
                  <p className="text-blue-600 font-bold">${item.price * item.quantity}</p>
                </div>
                <button
                  onClick={() => handleRemove(item.product)}
                  className="text-red-500 hover:text-red-700 font-medium"
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="bg-white rounded-xl shadow p-6 mt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold text-gray-800">Total:</span>
                <span className="text-2xl font-bold text-blue-600">${totalPrice}</span>
              </div>
              <Link
                to="/checkout"
                className="bg-blue-600 text-white w-full py-3 rounded-lg hover:bg-blue-700 transition block text-center"
              >
                Proceed to Checkout →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart