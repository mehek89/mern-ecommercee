import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { placeOrderApi } from '../api/orderApi'
import { clearCart } from '../redux/slices/cartSlice'

function Checkout() {
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { totalPrice } = useSelector((state) => state.cart)

  const handleOrder = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await placeOrderApi({
        shippingAddress: { address, city, postalCode, country: 'India' },
        paymentMethod: 'Card'
      })
      dispatch(clearCart())
      navigate('/orders')
    } catch (error) {
      setMessage('❌ Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">🛒 ShopMERN</Link>
        <Link to="/cart" className="text-gray-600 hover:text-blue-600">← Back to Cart</Link>
      </nav>

      <div className="max-w-lg mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h2>

        {message && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4">{message}</div>
        )}

        <form onSubmit={handleOrder} className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-gray-700">Shipping Address</h3>

          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="text"
            placeholder="Postal Code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <div className="border-t pt-4 mt-2">
            <div className="flex justify-between mb-4">
              <span className="font-semibold text-gray-700">Total:</span>
              <span className="font-bold text-blue-600 text-xl">${totalPrice}</span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white w-full py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Checkout