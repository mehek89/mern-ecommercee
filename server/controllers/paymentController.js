import Razorpay from 'razorpay'
import crypto from 'crypto'
import Order from '../models/Order.js'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

// Create Razorpay order
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR' } = req.body

    const options = {
      amount: Math.round(amount * 100), // Razorpay takes amount in paise
      currency,
      receipt: `receipt_${Date.now()}`,
    }

    const razorpayOrder = await razorpay.orders.create(options)

    res.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Verify payment
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = req.body

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature' })
    }

    // Update order as paid
    const order = await Order.findById(orderId)
    if (order) {
      order.isPaid = true
      order.paidAt = Date.now()
      order.status = 'processing'
      order.paymentResult = {
        id: razorpay_payment_id,
        status: 'paid',
        razorpay_order_id,
        razorpay_signature
      }
      await order.save()
    }

    res.json({ 
      success: true, 
      message: '✅ Payment verified successfully!' 
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get payment key
export const getPaymentKey = async (req, res) => {
  res.json({ keyId: process.env.RAZORPAY_KEY_ID })
}