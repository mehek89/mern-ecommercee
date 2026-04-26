import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { placeOrderApi } from '../api/orderApi'
import { clearCart } from '../redux/slices/cartSlice'
import axiosInstance from '../api/axiosInstance'

function Checkout() {
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponData, setCouponData] = useState(null)
  const [couponError, setCouponError] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { totalPrice, items } = useSelector((state) => state.cart)

  const finalTotal = couponData ? parseFloat(couponData.finalTotal) : totalPrice

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    setCouponLoading(true)
    setCouponError('')
    setCouponData(null)
    try {
      const { data } = await axiosInstance.post('/coupons/validate', {
        code: couponCode,
        orderTotal: totalPrice
      })
      setCouponData(data)
    } catch (error) {
      setCouponError(error.response?.data?.message || 'Invalid coupon')
    } finally {
      setCouponLoading(false)
    }
  }

  const handleOrder = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await placeOrderApi({
        shippingAddress: { address, city, postalCode, country: 'India' },
        paymentMethod: 'Card',
        couponCode: couponData?.code || '',
        totalPrice: finalTotal
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
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white px-4 py-3 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link to="/" className="text-2xl font-bold">🛒 ShopMERN</Link>
          <Link to="/cart" className="ml-auto text-sm hover:text-yellow-300">← Back to Cart</Link>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h2>

        {message && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4">{message}</div>
        )}

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <h3 className="font-bold text-gray-800 mb-3">Order Summary</h3>
          {items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{item.name} x {item.quantity}</span>
              <span>${item.price * item.quantity}</span>
            </div>
          ))}
          <div className="border-t mt-2 pt-2 flex justify-between font-semibold">
            <span>Subtotal</span>
            <span>${totalPrice}</span>
          </div>
          {couponData && (
            <div className="flex justify-between text-green-600 text-sm mt-1">
              <span>Discount ({couponData.code})</span>
              <span>-${couponData.discountAmount}</span>
            </div>
          )}
          <div className="flex justify-between text-blue-600 font-bold text-lg mt-2">
            <span>Total</span>
            <span>${finalTotal}</span>
          </div>
        </div>

        {/* Coupon Code */}
        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <h3 className="font-bold text-gray-800 mb-3">🏷️ Have a Coupon?</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 uppercase"
            />
            <button
              onClick={handleApplyCoupon}
              disabled={couponLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {couponLoading ? '...' : 'Apply'}
            </button>
          </div>
          {couponError && (
            <p className="text-red-500 text-sm mt-2">❌ {couponError}</p>
          )}
          {couponData && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
              <p className="text-green-700 font-medium">✅ {couponData.message}</p>
            </div>
          )}
        </div>

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
              <span className="font-semibold text-gray-700">Total to Pay:</span>
              <span className="font-bold text-blue-600 text-xl">${finalTotal}</span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white w-full py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium"
            >
              {loading ? 'Placing Order...' : '🛒 Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Checkout