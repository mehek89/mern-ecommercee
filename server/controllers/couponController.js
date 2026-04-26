import Coupon from '../models/Coupon.js'

// Validate coupon
export const validateCoupon = async (req, res) => {
  try {
    const { code, orderTotal } = req.body

    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(),
      isActive: true 
    })

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid coupon code' })
    }

    if (new Date() > coupon.expiryDate) {
      return res.status(400).json({ message: 'Coupon has expired' })
    }

    if (coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({ message: 'Coupon usage limit reached' })
    }

    if (orderTotal < coupon.minOrder) {
      return res.status(400).json({ 
        message: `Minimum order amount is $${coupon.minOrder}` 
      })
    }

    let discountAmount = 0
    if (coupon.discountType === 'percentage') {
      discountAmount = (orderTotal * coupon.discount) / 100
    } else {
      discountAmount = coupon.discount
    }

    const finalTotal = Math.max(0, orderTotal - discountAmount)

    res.json({
      valid: true,
      code: coupon.code,
      discount: coupon.discount,
      discountType: coupon.discountType,
      discountAmount: discountAmount.toFixed(2),
      finalTotal: finalTotal.toFixed(2),
      message: `Coupon applied! You save $${discountAmount.toFixed(2)}`
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Create coupon (admin)
export const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body)
    res.status(201).json(coupon)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get all coupons (admin)
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({})
    res.json(coupons)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete coupon (admin)
export const deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id)
    res.json({ message: 'Coupon deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}