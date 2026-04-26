import { useState, useEffect } from 'react'
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
  const [paymentMethod, setPaymentMethod] = useState('razorpay')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { totalPrice, items } = useSelector((state) => state.cart)
  const { user } = useSelector((state) => state.auth)

  const finalTotal = couponData ? parseFloat(couponData.finalTotal) : totalPrice

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    return () => document.body.removeChild(script)
  }, [])

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

  const handleRazorpayPayment = async (placedOrder) => {
    try {
      // Create Razorpay order
      const { data } = await axiosInstance.post('/payment/create-order', {
        amount: finalTotal
      })

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'ShopMERN',
        description: 'Purchase from ShopMERN',
        order_id: data.orderId,
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: '#2563EB' },
        handler: async (response) => {
          try {
            // Verify payment
            const verifyRes = await axiosInstance.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: placedOrder._id
            })

            if (verifyRes.data.success) {
              dispatch(clearCart())
              navigate('/orders')
            }
          } catch (error) {
            setMessage('❌ Payment verification failed')
            setLoading(false)
          }
        },
        modal: {
          ondismiss: () => {
            setMessage('⚠️ Payment cancelled')
            setLoading(false)
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      setMessage('❌ Failed to initiate payment')
      setLoading(false)
    }
  }

  const handleOrder = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      // First place the order
      const { data: placedOrder } = await placeOrderApi({
        shippingAddress: { address, city, postalCode, country: 'India' },
        paymentMethod: paymentMethod,
        couponCode: couponData?.code || '',
        totalPrice: finalTotal
      })

      if (paymentMethod === 'razorpay') {
        await handleRazorpayPayment(placedOrder)
      } else {
        // COD
        dispatch(clearCart())
        navigate('/orders')
      }
    } catch (error) {
      setMessage('❌ Failed to place order. Please try again.')
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
          <div className={`p-3 rounded mb-4 ${message.includes('✅') ? 'bg-green-100 text-green-700' : message.includes('⚠️') ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-600'}`}>
            {message}
          </div>
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
            <button onClick={handleApplyCoupon} disabled={couponLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
              {couponLoading ? '...' : 'Apply'}
            </button>
          </div>
          {couponError && <p className="text-red-500 text-sm mt-2">❌ {couponError}</p>}
          {couponData && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
              <p className="text-green-700 font-medium">✅ {couponData.message}</p>
            </div>
          )}
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <h3 className="font-bold text-gray-800 mb-3">💳 Payment Method</h3>
          <div className="flex flex-col gap-3">

            {/* Razorpay */}
            <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${paymentMethod === 'razorpay' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
              <input type="radio" name="payment" value="razorpay"
                checked={paymentMethod === 'razorpay'}
                onChange={() => setPaymentMethod('razorpay')} />
              <div>
                <p className="font-medium text-gray-800">💳 Pay Online</p>
                <p className="text-xs text-gray-500">Google Pay • PhonePe • BHIM UPI • Cards • Net Banking</p>
              </div>
              <div className="ml-auto flex gap-1">
                <span className="text-lg">🇬</span>
                <span className="text-lg">📱</span>
                <span className="text-lg">🏦</span>
              </div>
            </label>

            {/* COD */}
            <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${paymentMethod === 'cod' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
              <input type="radio" name="payment" value="cod"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')} />
              <div>
                <p className="font-medium text-gray-800">💵 Cash on Delivery</p>
                <p className="text-xs text-gray-500">Pay when you receive your order</p>
              </div>
              <span className="ml-auto text-2xl">💵</span>
            </label>
          </div>
        </div>

        <form onSubmit={handleOrder} className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-gray-700">📦 Shipping Address</h3>
          <input type="text" placeholder="Address" value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
          <input type="text" placeholder="City" value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
          <input type="text" placeholder="Postal Code" value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required />

          <div className="border-t pt-4 mt-2">
            <div className="flex justify-between mb-4">
              <span className="font-semibold text-gray-700">Total to Pay:</span>
              <span className="font-bold text-blue-600 text-xl">${finalTotal}</span>
            </div>
            <button type="submit" disabled={loading}
              className="bg-blue-600 text-white w-full py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium text-lg">
              {loading ? '⏳ Processing...' : paymentMethod === 'razorpay' ? '💳 Pay Now' : '🛒 Place Order (COD)'}
            </button>
          </div>
        </form>

        {/* Payment logos */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400 mb-2">Secured by Razorpay</p>
          <div className="flex justify-center gap-3 text-2xl">
            <span title="Google Pay">🇬</span>
            <span title="PhonePe">📱</span>
            <span title="UPI">💸</span>
            <span title="Visa/Mastercard">💳</span>
            <span title="Net Banking">🏦</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout