import express from 'express'
import {
  createRazorpayOrder,
  verifyPayment,
  getPaymentKey
} from '../controllers/paymentController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/key', protect, getPaymentKey)
router.post('/create-order', protect, createRazorpayOrder)
router.post('/verify', protect, verifyPayment)

export default router