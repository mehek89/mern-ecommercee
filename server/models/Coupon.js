import mongoose from 'mongoose'

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discount: { type: Number, required: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
  minOrder: { type: Number, default: 0 },
  maxUses: { type: Number, default: 100 },
  usedCount: { type: Number, default: 0 },
  expiryDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

const Coupon = mongoose.model('Coupon', couponSchema)
export default Coupon